// Si VITE_API_BASE_URL no existe (como en Vercel), usará "" (ruta relativa)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path) {
  // Construye la URL como "/api/teams", "/api/teams/standings", etc.
  const res = await fetch(`${BASE_URL}/api${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status} consultando la API`);
  }
  return res.json();
}

export function fetchTeams() {
  return request("/teams");
}

export function fetchTeamOverview(teamId) {
  return request(`/teams/${teamId}/overview`);
}

export function fetchStandings() {
  return request("/teams/standings");
}