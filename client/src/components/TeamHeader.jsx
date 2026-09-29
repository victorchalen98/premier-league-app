export default function TeamHeader({ team, position, isFavorite, onToggleFavorite }) {
  return (
    <header className="team-header">
      <img src={team.crest} alt={`Escudo de ${team.name}`} className="team-header__crest" />
      <div>
        <p className="team-header__eyebrow">Club</p>
        <div className="team-header__title-row">
          <h1 className="team-header__name">{team.name}</h1>
          <button
            className="favorite-button"
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
          >
            <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
            {isFavorite ? "Quitar de Favoritos" : "Añadir a Favoritos"}
          </button>
        </div>
        <dl className="team-header__facts">
          <div>
            <dt>Posición</dt>
            <dd>{position ? `${position}.ª` : "—"}</dd>
          </div>
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
