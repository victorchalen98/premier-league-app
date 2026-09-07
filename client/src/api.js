const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
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
