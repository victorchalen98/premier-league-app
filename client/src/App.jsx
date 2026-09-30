import { useEffect, useState } from "react";
import { fetchTeams, fetchTeamOverview, fetchStandings } from "./api";
import TeamSelector from "./components/TeamSelector.jsx";
import TeamHeader from "./components/TeamHeader.jsx";
import NextMatchCard from "./components/NextMatchCard.jsx";
import FormStreak from "./components/FormStreak.jsx";
import TopScorerCard from "./components/TopScorerCard.jsx";
import HeadToHeadCard from "./components/HeadToHeadCard.jsx";
import StandingsTable from "./components/StandingsTable.jsx";

const FAVORITE_TEAM_KEY = "premier-league-favorite-team";

const TEAM_ACCENTS = {
  ARS: "var(--team-ars)",
  AVL: "var(--team-avl)",
  BOU: "var(--team-bou)",
  BRE: "var(--team-bre)",
  BHA: "var(--team-bha)",
  BUR: "var(--team-bur)",
  CHE: "var(--team-che)",
  CRY: "var(--team-cry)",
  EVE: "var(--team-eve)",
  FUL: "var(--team-ful)",
  LEE: "var(--team-lee)",
  LIV: "var(--team-liv)",
  MCI: "var(--team-mci)",
  MUN: "var(--team-mun)",
  NEW: "var(--team-new)",
  NFO: "var(--team-nfo)",
  SUN: "var(--team-sun)",
  TOT: "var(--team-tot)",
  WHU: "var(--team-whu)",
  WOL: "var(--team-wol)",
};

function getFavoriteTeamId() {
  try {
    const storedId = window.localStorage.getItem(FAVORITE_TEAM_KEY);
    return storedId ? Number(storedId) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [favoriteTeamId, setFavoriteTeamId] = useState(null);
  const [overview, setOverview] = useState(null);
  const [standings, setStandings] = useState(null);
  const [view, setView] = useState("standings");

  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        setTeams(data.teams);
        const favoriteId = getFavoriteTeamId();
        const favoriteTeam = data.teams.find((team) => team.id === favoriteId);
        setFavoriteTeamId(favoriteTeam?.id ?? null);
        setSelectedId(favoriteTeam?.id ?? data.teams[0]?.id ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingTeams(false));
  }, []);

  function toggleFavorite(teamId) {
    const nextFavoriteId = favoriteTeamId === teamId ? null : teamId;
    setFavoriteTeamId(nextFavoriteId);
    try {
      if (nextFavoriteId === null) {
        window.localStorage.removeItem(FAVORITE_TEAM_KEY);
      } else {
        window.localStorage.setItem(FAVORITE_TEAM_KEY, String(nextFavoriteId));
      }
    } catch {
      // El favorito sigue activo durante esta sesión si el almacenamiento está bloqueado.
    }
  }

  useEffect(() => {
    if (view !== "overview" || !selectedId) return;
    setLoadingOverview(true);
    setError(null);
    fetchTeamOverview(selectedId)
      .then(setOverview)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingOverview(false));
  }, [selectedId, view]);

  // La tabla de posiciones no depende del equipo elegido, así que se pide
  // una sola vez, la primera vez que el usuario abre esa pestaña.
  useEffect(() => {
    if (view !== "standings" || standings) return;
    setLoadingStandings(true);
    fetchStandings()
      .then((data) => setStandings(data.table))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingStandings(false));
  }, [view, standings]);

  function showTeamOverview(teamId) {
    setSelectedId(teamId);
    setView("overview");
  }

  const selectedPosition = standings?.find((row) => row.teamId === selectedId)?.position;
  const selectedTeam = teams.find((team) => team.id === selectedId);
  const accent = TEAM_ACCENTS[selectedTeam?.tla] ?? "var(--pl-purple)";

  return (
    <div className="layout" style={{ "--color-accent": accent }}>
      <nav className="top-nav" aria-label="Navegación principal">
        <button
          className={"top-nav__item" + (view === "standings" ? " top-nav__item--active" : "")}
          onClick={() => setView("standings")}
          aria-current={view === "standings" ? "page" : undefined}
        >
          Tabla de posiciones
        </button>
      </nav>

      {loadingTeams ? (
        <p className="status">Cargando equipos…</p>
      ) : (
        <TeamSelector
          teams={teams}
          selectedId={selectedId}
          favoriteTeamId={favoriteTeamId}
          onSelect={showTeamOverview}
        />
      )}

      <main className="content">
        {error && <p className="status status--error">{error}</p>}

        {view === "overview" && (
          <>
            {loadingOverview && <p className="status">Cargando datos del equipo…</p>}

            {overview && !loadingOverview && (
              <>
                <TeamHeader
                  team={overview.team}
                  position={selectedPosition}
                  isFavorite={favoriteTeamId === overview.team.id}
                  onToggleFavorite={() => toggleFavorite(overview.team.id)}
                />
                <div className="content__grid">
                  <NextMatchCard team={overview.team} nextMatch={overview.nextMatch} />
                  <HeadToHeadCard
                    headToHead={overview.headToHead}
                    rival={overview.nextMatch?.rival}
                  />
                  <FormStreak form={overview.form} />
                  <TopScorerCard scorer={overview.topScorer} />
                </div>
              </>
            )}
          </>
        )}

        {view === "standings" && (
          <>
            {loadingStandings && <p className="status">Cargando tabla de posiciones…</p>}
            {standings && (
              <StandingsTable
                table={standings}
                selectedId={selectedId}
                onSelectTeam={showTeamOverview}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
