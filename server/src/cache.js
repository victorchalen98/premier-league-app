// Cache en memoria muy simple, basado en un Map con expiración por clave.
// football-data.org (plan free) permite solo 10 requests/minuto, así que
// evitar pegarle de nuevo por datos que casi no cambian es importante.

const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
}

export function setCached(key, value, ttlMs) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

// Envuelve una función asíncrona (ej. una llamada a la API) con cache.
// Si hay un valor vigente en cache, lo devuelve sin llamar a `fetcher`.
export async function withCache(key, ttlMs, fetcher) {
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  const value = await fetcher();
  setCached(key, value, ttlMs);
  return value;
}
