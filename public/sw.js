/**
 * Service worker do EcoRewards.
 * Estratégia deliberadamente simples: um app shell pré-cacheado para que a
 * aplicação abra offline, cache-first para estáticos e network-first para
 * navegação, caindo na página /offline quando não há rede.
 */

const VERSAO = "ecorewards-v1";
const SHELL = `${VERSAO}-shell`;
const RUNTIME = `${VERSAO}-runtime`;

const ROTAS_SHELL = ["/", "/app", "/demo", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(ROTAS_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => !chave.startsWith(VERSAO))
            .map((chave) => caches.delete(chave)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copia));
          return resposta;
        })
        .catch(async () => {
          const cacheado = await caches.match(request);
          return cacheado ?? caches.match("/offline");
        }),
    );
    return;
  }

  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cacheado) =>
          cacheado ??
          fetch(request).then((resposta) => {
            const copia = resposta.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copia));
            return resposta;
          }),
      ),
    );
  }
});
