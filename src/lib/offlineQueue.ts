"use client";

const DB_NAME = "vacci-rappel-secure";
const DB_VERSION = 1;
const MUTATIONS = "mutations";
const KEYS = "keys";

export type QueueItemView = {
  id: string;
  url: string;
  method: "PATCH" | "POST" | "PUT";
  createdAt: string;
  state: "pending" | "conflict";
  local: Record<string, unknown>;
  server?: Record<string, unknown>;
};

type StoredMutation = {
  id: string;
  url: string;
  method: "PATCH" | "POST" | "PUT";
  createdAt: string;
  state: "pending" | "conflict";
  iv: string;
  payload: string;
};

type MutationInput = {
  url: string;
  method?: "PATCH" | "POST" | "PUT";
  body: Record<string, unknown>;
};

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MUTATIONS)) {
        db.createObjectStore(MUTATIONS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(KEYS)) {
        db.createObjectStore(KEYS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getEncryptionKey(db: IDBDatabase) {
  const transaction = db.transaction(KEYS, "readwrite");
  const store = transaction.objectStore(KEYS);
  const existing = await requestResult(store.get("device-key"));
  if (existing instanceof CryptoKey) return existing;

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  store.put(key, "device-key");
  return key;
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function encrypt(value: unknown, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    iv: toBase64(iv),
    payload: toBase64(new Uint8Array(encrypted)),
  };
}

async function decrypt(record: StoredMutation, key: CryptoKey) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(record.iv) },
    key,
    fromBase64(record.payload),
  );
  return JSON.parse(new TextDecoder().decode(decrypted)) as {
    local: Record<string, unknown>;
    server?: Record<string, unknown>;
  };
}

async function saveMutation(record: StoredMutation) {
  const db = await openDb();
  const transaction = db.transaction(MUTATIONS, "readwrite");
  transaction.objectStore(MUTATIONS).put(record);
}

export async function enqueueMutation(input: MutationInput) {
  const db = await openDb();
  const key = await getEncryptionKey(db);
  const encrypted = await encrypt({ local: input.body }, key);
  const record: StoredMutation = {
    id: crypto.randomUUID(),
    url: input.url,
    method: input.method || "PATCH",
    createdAt: new Date().toISOString(),
    state: "pending",
    ...encrypted,
  };
  await saveMutation(record);
  window.dispatchEvent(new Event("vacci:queue-changed"));
  return record.id;
}

async function deleteMutation(id: string) {
  const db = await openDb();
  const transaction = db.transaction(MUTATIONS, "readwrite");
  transaction.objectStore(MUTATIONS).delete(id);
}

async function markConflict(
  record: StoredMutation,
  local: Record<string, unknown>,
  server: Record<string, unknown>,
) {
  const db = await openDb();
  const key = await getEncryptionKey(db);
  const encrypted = await encrypt({ local, server }, key);
  await saveMutation({ ...record, ...encrypted, state: "conflict" });
}

export async function getQueueItems(): Promise<QueueItemView[]> {
  if (!("indexedDB" in window)) return [];
  const db = await openDb();
  const key = await getEncryptionKey(db);
  const transaction = db.transaction(MUTATIONS, "readonly");
  const records = await requestResult(
    transaction.objectStore(MUTATIONS).getAll(),
  ) as StoredMutation[];

  return Promise.all(
    records.map(async (record) => {
      const decrypted = await decrypt(record, key);
      return {
        id: record.id,
        url: record.url,
        method: record.method,
        createdAt: record.createdAt,
        state: record.state,
        ...decrypted,
      };
    }),
  );
}

export async function syncQueuedMutations() {
  if (!navigator.onLine) return { synced: 0, conflicts: 0 };
  const items = await getQueueItems();
  let synced = 0;
  let conflicts = 0;

  for (const item of items.filter((entry) => entry.state === "pending")) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.local),
      });
      if ([409, 412, 422].includes(response.status)) {
        const conflict = await response.json();
        const db = await openDb();
        const transaction = db.transaction(MUTATIONS, "readonly");
        const stored = await requestResult(
          transaction.objectStore(MUTATIONS).get(item.id),
        ) as StoredMutation;
        await markConflict(stored, item.local, conflict.server || conflict);
        conflicts += 1;
      } else if (response.ok) {
        await deleteMutation(item.id);
        synced += 1;
      }
    } catch {
      break;
    }
  }

  window.dispatchEvent(new Event("vacci:queue-changed"));
  return { synced, conflicts };
}

export async function resolveQueueConflict(id: string, choice: "server" | "local") {
  const item = (await getQueueItems()).find((entry) => entry.id === id);
  if (!item) return false;
  if (choice === "server") {
    await deleteMutation(id);
    window.dispatchEvent(new Event("vacci:queue-changed"));
    return true;
  }

  const response = await fetch(item.url, {
    method: item.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...item.local,
      baseVersion: item.server?.version,
      force: true,
    }),
  });
  if (!response.ok) return false;
  await deleteMutation(id);
  window.dispatchEvent(new Event("vacci:queue-changed"));
  return true;
}

export async function mutateWithOfflineQueue(input: MutationInput) {
  if (!navigator.onLine) {
    await enqueueMutation(input);
    return { ok: true, queued: true, conflict: false };
  }

  try {
    const response = await fetch(input.url, {
      method: input.method || "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.body),
    });
    if ([409, 412, 422].includes(response.status)) {
      const id = await enqueueMutation(input);
      const conflict = await response.json();
      const db = await openDb();
      const transaction = db.transaction(MUTATIONS, "readonly");
      const stored = await requestResult(
        transaction.objectStore(MUTATIONS).get(id),
      ) as StoredMutation;
      await markConflict(stored, input.body, conflict.server || conflict);
      return { ok: false, queued: true, conflict: true };
    }
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return {
        ok: false,
        queued: false,
        conflict: false,
        error:
          errorBody?.message ||
          `La requête a échoué avec le code ${response.status}.`,
      };
    }
    const data = await response.clone().json().catch(() => null);
    return { ok: true, queued: false, conflict: false, data };
  } catch {
    await enqueueMutation(input);
    return { ok: true, queued: true, conflict: false };
  }
}
