export default function TeamSelector({ teams, selectedId, favoriteTeamId, onSelect }) {
  const sortedTeams = [...teams].sort((teamA, teamB) =>
    teamA.id === favoriteTeamId
      ? -1
      : teamB.id === favoriteTeamId
        ? 1
        : (teamA.shortName || teamA.name).localeCompare(
            teamB.shortName || teamB.name,
            "es",
            { sensitivity: "base" },
          ),
  );

  return (
    <nav className="team-selector" aria-label="Selector de equipos">
      <h2 className="team-selector__title">Premier League</h2>
      <ul className="team-selector__list">
        {sortedTeams.map((team) => (
          <li key={team.id}>
            <button
              className={
                "team-selector__item" +
                (team.id === selectedId ? " team-selector__item--active" : "")
              }
              onClick={() => onSelect(team.id)}
              aria-pressed={team.id === selectedId}
            >
              <img src={team.crest} alt="" className="team-selector__crest" />
              <span>{team.shortName || team.name}</span>
              {team.id === favoriteTeamId && (
                <span className="team-selector__favorite" aria-hidden="true">
                  ★
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
