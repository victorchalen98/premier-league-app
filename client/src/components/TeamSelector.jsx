export default function TeamSelector({ teams, selectedId, onSelect }) {
  const sortedTeams = [...teams].sort((teamA, teamB) =>
    (teamA.shortName || teamA.name).localeCompare(
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
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
