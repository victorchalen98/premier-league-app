import { useEffect, useState } from "react";
import { fetchTeams, fetchTeamOverview, fetchStandings } from "./api";
import TeamSelector from "./components/TeamSelector.jsx";
import TeamHeader from "./components/TeamHeader.jsx";
import NextMatchCard from "./components/NextMatchCard.jsx";
import FormStreak from "./components/FormStreak.jsx";
import TopScorerCard from "./components/TopScorerCard.jsx";
import HeadToHeadCard from "./components/HeadToHeadCard.jsx";
import StandingsTable from "./components/StandingsTable.jsx";

export default function App() {
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
        if (data.teams.length > 0) setSelectedId(data.teams[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingTeams(false));
  }, []);

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

  return (
    <div className="layout">
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
        <TeamSelector teams={teams} selectedId={selectedId} onSelect={showTeamOverview} />
      )}

      <main className="content">
        {error && <p className="status status--error">{error}</p>}

        {view === "overview" && (
          <>
            {loadingOverview && <p className="status">Cargando datos del equipo…</p>}

            {overview && !loadingOverview && (
              <>
                <TeamHeader team={overview.team} position={selectedPosition} />
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
