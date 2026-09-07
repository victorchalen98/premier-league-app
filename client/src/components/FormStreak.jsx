const RESULT_LABEL = { W: "Ganó", D: "Empató", L: "Perdió" };

export default function FormStreak({ form }) {
  if (!form || form.length === 0) {
    return (
      <section className="card">
        <p className="card__label">Racha (últimos 5)</p>
        <p className="ticket__empty">Todavía no hay partidos jugados.</p>
      </section>
    );
  }

  // Se muestran del más antiguo al más reciente, como una línea de tiempo.
  const ordered = [...form].reverse();

  return (
    <section className="card">
      <p className="card__label">Racha (últimos 5)</p>
      <ol className="streak">
        {ordered.map((match) => (
          <li
            key={match.matchId}
            className={`streak__pill streak__pill--${match.result.toLowerCase()}`}
            title={`${RESULT_LABEL[match.result]} ${match.scoreFor}-${match.scoreAgainst} vs ${match.rival.name}`}
          >
            {match.result}
          </li>
        ))}
      </ol>
      <p className="streak__latest">
        Último: {RESULT_LABEL[ordered[ordered.length - 1].result]}{" "}
        {ordered[ordered.length - 1].scoreFor}-{ordered[ordered.length - 1].scoreAgainst} vs{" "}
        {ordered[ordered.length - 1].rival.shortName || ordered[ordered.length - 1].rival.name}
      </p>
    </section>
  );
}
