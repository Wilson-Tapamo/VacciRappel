const VERSION = "vacci-rappel-v7";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const DATA_CACHE = `${VERSION}-data`;

const APP_ROUTES = [
  "/",
  "/account",
  "/alerts",
  "/calendar",
  "/children/add",
  "/hospitals",
  "/map",
  "/profile",
  "/scan",
  "/support",
  "/vaccine-library",
  "/vaccines",
];

const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/brand/logo-mark.png",
  "/brand/logo-wordmark.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/documents/calendrier-rattrapage-pev-2024.pdf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.allSettled(
      STATIC_ASSETS.map(async (url) => {
        const cache = await caches.open(STATIC_CACHE);
        const response = await fetch(url, { credentials: "include" });
        if (response.ok) await cache.put(url, response);
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => ![STATIC_CACHE, PAGE_CACHE, DATA_CACHE].includes(key),
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

async function fetchWithTimeout(request, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function networkFirst(request, cacheName, fallback, timeoutMs = 10000) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetchWithTimeout(request, timeoutMs);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return fallback();
  }
}

function isCacheablePageResponse(response) {
  if (!response.ok || response.redirected) return false;

  try {
    const responseUrl = new URL(response.url);
    return (
      responseUrl.origin === self.location.origin &&
      !responseUrl.pathname.startsWith("/auth/")
    );
  } catch {
    return false;
  }
}

async function pageStaleWhileRevalidate(event) {
  const request = event.request;
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  const pathname = new URL(request.url).pathname;
  const update = fetch(request)
    .then(async (response) => {
      if (isCacheablePageResponse(response)) {
        await cache.put(pathname, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(update);
    return cached;
  }

  const response = await update;
  if (response) return response;
  return (
    (await cache.match(pathname)) ||
    (await cache.match("/")) ||
    new Response("Application indisponible", { status: 503 })
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(pageStaleWhileRevalidate(event));
    return;
  }

  // Never cache or abort session and CSRF requests. NextAuth must keep direct
  // control of the complete authentication exchange.
  if (url.pathname.startsWith("/api/auth/")) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      networkFirst(
        request,
        DATA_CACHE,
        () =>
          new Response(
            url.pathname === "/api/children" || url.pathname === "/api/vaccines"
              ? "[]"
              : "{}",
            {
              headers: {
                "Content-Type": "application/json",
                "X-VacciRappel-Offline": "true",
              },
            },
          ),
        10000,
      ),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname.startsWith("/documents/") ||
    /\.(?:png|jpg|jpeg|svg|webp|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_APP") return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE);

      // The client sends CACHE_APP only after authentication. Sequential
      // requests avoid a burst of protected navigations on mobile networks.
      for (const url of APP_ROUTES) {
        try {
          const response = await fetch(url, { credentials: "include" });
          if (isCacheablePageResponse(response)) {
            await cache.put(url, response);
          }
        } catch {
          // A partial cache is still useful when the connection is unstable.
        }
      }
    })(),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json?.() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "VacciRappel", {
      body: data.body || "Un rappel vaccinal vous attend.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/alerts" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/alerts"));
});
