export default function TeamSelector({ teams, selectedId, onSelect }) {
  return (
    <nav className="team-selector" aria-label="Selector de equipos">
      <h2 className="team-selector__title">Premier League</h2>
      <ul className="team-selector__list">
        {teams.map((team) => (
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
