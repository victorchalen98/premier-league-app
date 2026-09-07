function formatDate(iso) {
  const date = new Date(iso);
  const dateStr = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return { dateStr, timeStr };
}

export default function NextMatchCard({ team, nextMatch }) {
  if (!nextMatch) {
    return (
      <section className="card ticket">
        <p className="card__label">Próximo partido</p>
        <p className="ticket__empty">No hay partidos programados por ahora.</p>
      </section>
    );
  }

  const { dateStr, timeStr } = formatDate(nextMatch.date);
  const home = nextMatch.isHome ? team : nextMatch.rival;
  const away = nextMatch.isHome ? nextMatch.rival : team;

  return (
    <section className="card ticket">
      <p className="card__label">Próximo partido · Jornada {nextMatch.matchday}</p>
      <div className="ticket__teams">
        <div className="ticket__team">
          <img src={home.crest} alt="" className="ticket__crest" />
          <span>{home.shortName || home.name}</span>
        </div>
        <span className="ticket__vs">vs</span>
        <div className="ticket__team">
          <img src={away.crest} alt="" className="ticket__crest" />
          <span>{away.shortName || away.name}</span>
        </div>
      </div>
      <div className="ticket__stub" />
      <div className="ticket__meta">
        <span>{dateStr}</span>
        <span>{timeStr} hs</span>
        {nextMatch.venue && <span>{nextMatch.venue}</span>}
      </div>
    </section>
  );
}
