import axios from "axios";
import { withCache } from "./cache.js";

const BASE_URL = "https://api.football-data.org/v4";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
  },
  timeout: 10_000,
});

// TTLs pensados para no pisar el límite de 10 req/min del plan free.
export const TTL = {
  TEAMS_LIST: 1000 * 60 * 60 * 6, // 6 horas: la lista de equipos casi no cambia
  TEAM_DETAIL: 1000 * 60 * 30, // 30 min
  MATCHES: 1000 * 60 * 5, // 5 min: próximos partidos / resultados
  SCORERS: 1000 * 60 * 15, // 15 min: es un recurso de toda la competición, se reutiliza para todos los equipos
  STANDINGS: 1000 * 60 * 30, // 30 min: la tabla no cambia mientras no se juegan partidos
  HEAD_TO_HEAD: 1000 * 60 * 60 * 3, // 3 horas: el historial entre dos equipos no cambia hasta que juegan de nuevo
};

async function get(path, params = {}) {
  try {
    const { data } = await client.get(path, { params });
    return data;
  } catch (error) {
    if (error.response?.status === 429) {
      const err = new Error(
        "Se alcanzó el límite de requests de football-data.org, probá de nuevo en un minuto."
      );
      err.status = 429;
      throw err;
    }
    if (error.response) {
      const err = new Error(
        error.response.data?.message || "Error consultando football-data.org"
      );
      err.status = error.response.status;
      throw err;
    }
    throw error;
  }
}

export function getPremierLeagueTeams() {
  return withCache("teams:PL", TTL.TEAMS_LIST, () =>
    get("/competitions/PL/teams")
  );
}

export function getTeamDetail(teamId) {
  return withCache(`team:${teamId}`, TTL.TEAM_DETAIL, () =>
    get(`/teams/${teamId}`)
  );
}

export function getUpcomingMatches(teamId) {
  return withCache(`matches:upcoming:${teamId}`, TTL.MATCHES, () =>
    get(`/teams/${teamId}/matches`, { status: "SCHEDULED", limit: 5 })
  );
}

export function getRecentMatches(teamId) {
  return withCache(`matches:recent:${teamId}`, TTL.MATCHES, () =>
    get(`/teams/${teamId}/matches`, { status: "FINISHED", limit: 5 })
  );
}

// Los goleadores se piden por competición completa (no hay endpoint "por
// equipo"), así que este resultado se comparte y filtra en memoria para
// cada equipo. Eso evita una llamada nueva por cada selección de equipo.
export function getCompetitionScorers() {
  return withCache("scorers:PL", TTL.SCORERS, () =>
    get("/competitions/PL/scorers", { limit: 100 })
  );
}

export function getStandings() {
  return withCache("standings:PL", TTL.STANDINGS, () =>
    get("/competitions/PL/standings")
  );
}

// El id de partido es el del próximo partido del equipo (ver getUpcomingMatches).
export function getHeadToHead(matchId) {
  return withCache(`h2h:${matchId}`, TTL.HEAD_TO_HEAD, () =>
    get(`/matches/${matchId}/head2head`, { limit: 10 })
  );
}
