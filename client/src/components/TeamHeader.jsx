export default function TeamHeader({ team }) {
  return (
    <header className="team-header">
      <img src={team.crest} alt={`Escudo de ${team.name}`} className="team-header__crest" />
      <div>
        <p className="team-header__eyebrow">Club</p>
        <h1 className="team-header__name">{team.name}</h1>
        <dl className="team-header__facts">
          {team.venue && (
            <div>
              <dt>Estadio</dt>
              <dd>{team.venue}</dd>
            </div>
          )}
          {team.founded && (
            <div>
              <dt>Fundado</dt>
              <dd>{team.founded}</dd>
            </div>
          )}
          {team.coach && (
            <div>
              <dt>DT</dt>
              <dd>{team.coach}</dd>
            </div>
          )}
        </dl>
      </div>
    </header>
  );
}
