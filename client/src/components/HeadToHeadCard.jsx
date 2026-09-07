function formatShortDate(iso) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function HeadToHeadCard({ headToHead, rival }) {
  if (!headToHead || headToHead.totalMatches === 0) {
    return (
      <section className="card">
        <p className="card__label">
          Historial{rival ? ` vs ${rival.shortName || rival.name}` : ""}
        </p>
        <p className="ticket__empty">Sin enfrentamientos recientes registrados.</p>
      </section>
    );
  }

  const { teamWins, rivalWins, draws, totalMatches, recentMeetings } = headToHead;
  const winPct = (teamWins / totalMatches) * 100;
  const drawPct = (draws / totalMatches) * 100;
  const rivalPct = (rivalWins / totalMatches) * 100;

  return (
    <section className="card h2h">
      <p className="card__label">Historial vs {rival.shortName || rival.name}</p>

      <div className="h2h__bar" role="img" aria-label={`${teamWins} ganados, ${draws} empates, ${rivalWins} perdidos`}>
        <span className="h2h__segment h2h__segment--win" style={{ width: `${winPct}%` }} />
        <span className="h2h__segment h2h__segment--draw" style={{ width: `${drawPct}%` }} />
        <span className="h2h__segment h2h__segment--loss" style={{ width: `${rivalPct}%` }} />
      </div>
      <div className="h2h__legend">
        <span>{teamWins} ganados</span>
        <span>{draws} empates</span>
        <span>{rivalWins} perdidos</span>
      </div>

      {recentMeetings.length > 0 && (
        <ul className="h2h__list">
          {recentMeetings.map((m) => (
            <li key={m.matchId}>
              <span className="h2h__list-date">{formatShortDate(m.date)}</span>
              <span>
                {m.homeTeam.shortName || m.homeTeam.name} {m.scoreHome}-{m.scoreAway}{" "}
                {m.awayTeam.shortName || m.awayTeam.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
