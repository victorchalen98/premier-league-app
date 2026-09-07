import { Router } from "express";
import {
  getPremierLeagueTeams,
  getTeamDetail,
  getUpcomingMatches,
  getRecentMatches,
  getCompetitionScorers,
  getStandings,
  getHeadToHead,
} from "../footballDataClient.js";

const router = Router();

// GET /api/teams  -> lista liviana para el selector de equipos
router.get("/", async (req, res, next) => {
  try {
    const data = await getPremierLeagueTeams();
    const teams = data.teams
      .map((t) => ({
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        tla: t.tla,
        crest: t.crest,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ teams });
  } catch (err) {
    next(err);
  }
});

// GET /api/teams/standings -> tabla de posiciones completa de la Premier League
router.get("/standings", async (req, res, next) => {
  try {
    const data = await getStandings();
    const totalTable = data.standings.find((s) => s.type === "TOTAL");

    const table = (totalTable?.table || []).map((row) => ({
      position: row.position,
      teamId: row.team.id,
      teamName: row.team.name,
      crest: row.team.crest,
      played: row.playedGames,
      won: row.won,
      draw: row.draw,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
    }));

    res.json({ table });
  } catch (err) {
    next(err);
  }
});

function buildResult(match, teamId) {
  const isHome = match.homeTeam.id === teamId;
  const teamScore = isHome
    ? match.score.fullTime.home
    : match.score.fullTime.away;
  const rivalScore = isHome
    ? match.score.fullTime.away
    : match.score.fullTime.home;

  let result = "D";
  if (teamScore > rivalScore) result = "W";
  if (teamScore < rivalScore) result = "L";

  return {
    matchId: match.id,
    date: match.utcDate,
    isHome,
    rival: isHome ? match.awayTeam : match.homeTeam,
    scoreFor: teamScore,
    scoreAgainst: rivalScore,
    result,
  };
}

// GET /api/teams/:id/overview -> todo lo que necesita la pantalla de un equipo
router.get("/:id/overview", async (req, res, next) => {
  const teamId = Number(req.params.id);
  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ message: "id de equipo inválido" });
  }

  try {
    const [team, upcoming, recent, scorers] = await Promise.all([
      getTeamDetail(teamId),
      getUpcomingMatches(teamId),
      getRecentMatches(teamId),
      getCompetitionScorers(),
    ]);

    const nextMatch = upcoming.matches?.[0]
      ? (() => {
          const m = upcoming.matches[0];
          const isHome = m.homeTeam.id === teamId;
          return {
            matchId: m.id,
            date: m.utcDate,
            matchday: m.matchday,
            isHome,
            rival: isHome ? m.awayTeam : m.homeTeam,
            venue: team.venue || null,
          };
        })()
      : null;

    const form = (recent.matches || [])
      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
      .slice(0, 5)
      .map((m) => buildResult(m, teamId));

    // El historial depende del próximo partido, así que se pide después
    // (no rompe el resto del overview si esto falla o no hay próximo partido).
    let headToHead = null;
    if (nextMatch) {
      try {
        const h2h = await getHeadToHead(nextMatch.matchId);
        const homeAgg = h2h.aggregates.homeTeam;
        const awayAgg = h2h.aggregates.awayTeam;
        const teamAgg = nextMatch.isHome ? homeAgg : awayAgg;
        const rivalAgg = nextMatch.isHome ? awayAgg : homeAgg;

        headToHead = {
          totalMatches: h2h.aggregates.numberOfMatches,
          teamWins: teamAgg.wins,
          rivalWins: rivalAgg.wins,
          draws: teamAgg.draws,
          recentMeetings: (h2h.matches || [])
            .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
            .slice(0, 5)
            .map((m) => ({
              matchId: m.id,
              date: m.utcDate,
              competition: m.competition?.name || null,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              scoreHome: m.score.fullTime.home,
              scoreAway: m.score.fullTime.away,
            })),
        };
      } catch (err) {
        headToHead = null;
      }
    }

    const teamScorers = (scorers.scorers || [])
      .filter((s) => s.team.id === teamId)
      .sort((a, b) => (b.goals || 0) - (a.goals || 0));

    const topScorer = teamScorers[0]
      ? {
          name: teamScorers[0].player.name,
          nationality: teamScorers[0].player.nationality,
          goals: teamScorers[0].goals,
          assists: teamScorers[0].assists ?? null,
          penalties: teamScorers[0].penalties ?? null,
        }
      : null;

    res.json({
      team: {
        id: team.id,
        name: team.name,
        crest: team.crest,
        founded: team.founded,
        venue: team.venue,
        clubColors: team.clubColors,
        coach: team.coach?.name || null,
      },
      nextMatch,
      form,
      topScorer,
      headToHead,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
