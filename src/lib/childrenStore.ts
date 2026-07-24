"use client";

export type VaccinationStatus = "PENDING" | "DONE";

export type CachedVaccination = {
  id: string;
  status?: string;
  completedAt?: string | null;
  version?: number;
  [key: string]: unknown;
};

export type CachedChild = {
  id: string;
  vaccinations?: CachedVaccination[];
  [key: string]: unknown;
};

let childrenCache: CachedChild[] | null = null;
let childrenRequest: Promise<CachedChild[]> | null = null;

function emitChildrenChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vacci:children-changed", {
      detail: childrenCache,
    }));
  }
}

export function getCachedChildren() {
  return childrenCache;
}

export function setCachedChildren(children: CachedChild[]) {
  childrenCache = children;
  emitChildrenChanged();
  return children;
}

export async function loadChildren(force = false) {
  if (!force && childrenCache) return childrenCache;
  if (!force && childrenRequest) return childrenRequest;

  childrenRequest = fetch("/api/children")
    .then(async (response): Promise<CachedChild[]> => {
      if (!response.ok) throw new Error("Impossible de charger les profils.");
      const data = await response.json();
      return setCachedChildren(Array.isArray(data) ? data : []);
    })
    .finally(() => {
      childrenRequest = null;
    });

  return childrenRequest;
}

export function updateCachedVaccination(
  recordId: string,
  status: VaccinationStatus,
) {
  if (!childrenCache) return;

  childrenCache = childrenCache.map((child) => ({
    ...child,
    vaccinations: (child.vaccinations || []).map((vaccination) =>
      vaccination.id === recordId
        ? {
            ...vaccination,
            status,
            completedAt: status === "DONE" ? new Date().toISOString() : null,
            version: (vaccination.version || 0) + 1,
          }
        : vaccination,
    ),
  }));
  emitChildrenChanged();
}

export function addCachedChild(child: CachedChild) {
  childrenCache = [...(childrenCache || []), child];
  emitChildrenChanged();
}
