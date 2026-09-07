function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TopScorerCard({ scorer }) {
  if (!scorer) {
    return (
      <section className="card">
        <p className="card__label">Goleador del equipo</p>
        <p className="ticket__empty">Sin datos de goleadores todavía.</p>
      </section>
    );
  }

  return (
    <section className="card scorer">
      <p className="card__label">Goleador del equipo</p>
      <div className="scorer__body">
        <div className="scorer__avatar">{initials(scorer.name)}</div>
        <div>
          <p className="scorer__name">{scorer.name}</p>
          {scorer.nationality && <p className="scorer__nationality">{scorer.nationality}</p>}
        </div>
        <div className="scorer__goals">
          <span className="scorer__goals-number">{scorer.goals}</span>
          <span className="scorer__goals-label">goles</span>
        </div>
      </div>
    </section>
  );
}
