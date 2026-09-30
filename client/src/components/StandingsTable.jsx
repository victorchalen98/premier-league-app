export default function StandingsTable({ table, selectedId, onSelectTeam }) {
  if (!table || table.length === 0) {
    return <p className="status">Cargando tabla de posiciones…</p>;
  }

  return (
    <div className="standings">
      <table className="standings__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>DG</th>
            <th>Pts</th>
            <th>Racha</th>
            <th>Siguiente</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr
              key={row.teamId}
              className={
                "standings__row" +
                (row.teamId === selectedId ? " standings__row--active" : "")
              }
              onClick={() => onSelectTeam(row.teamId)}
            >
              <td>{row.position}</td>
              <td className="standings__team">
                <img src={row.crest} alt="" className="standings__crest" />
                {row.teamName}
              </td>
              <td>{row.played}</td>
              <td>{row.won}</td>
              <td>{row.draw}</td>
              <td>{row.lost}</td>
              <td>{row.goalDifference}</td>
              <td className="standings__points">{row.points}</td>
              <td>
                <ol className="standings__form" aria-label="Últimos cinco partidos">
                  {(row.form || []).slice().reverse().map((match) => (
                    <li
                      key={match.matchId}
                      className={`streak__pill streak__pill--${match.result.toLowerCase()}`}
                      title={`${match.scoreFor}-${match.scoreAgainst} vs ${match.rival.name}`}
                    >
                      {match.result}
                    </li>
                  ))}
                </ol>
              </td>
              <td className="standings__next">
                {row.nextMatch ? (
                  <>
                    <span>{row.nextMatch.rival.shortName || row.nextMatch.rival.name}</span>
                    <time dateTime={row.nextMatch.date}>
                      {new Intl.DateTimeFormat("es-ES", {
                        day: "2-digit",
                        month: "short",
                      }).format(new Date(row.nextMatch.date))}
                    </time>
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
