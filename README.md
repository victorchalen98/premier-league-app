# Premier League Matchday

App para elegir un equipo de la Premier League y ver:
- Próximo rival (fecha, jornada, local/visitante)
- Goleador del equipo
- Racha de los últimos 5 partidos (W/D/L)
- Historial cabeza a cabeza contra el próximo rival
- Tabla de posiciones completa (pestaña aparte, click en un equipo te lleva a su resumen)

Datos vía [football-data.org](https://www.football-data.org/).

## Por qué hay un backend

football-data.org bloquea las llamadas directas desde el navegador (CORS) y,
si el fetch se hiciera desde el cliente, tu API key quedaría expuesta en el
código del frontend. Por eso `server/` actúa de proxy: guarda la key en una
variable de entorno, cachea las respuestas (el plan free permite 10
requests/minuto) y le devuelve al cliente solo los datos ya combinados y
listos para mostrar.

## Estructura

```
premier-league-app/
├── server/   # Express, proxy hacia football-data.org
└── client/   # React + Vite
```

## Puesta en marcha

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Editá .env y pegá tu FOOTBALL_DATA_API_KEY
npm run dev
```

Queda escuchando en `http://localhost:4000`.

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
cp .env.example .env   # opcional, ya apunta a localhost:4000 por default
npm run dev
```

Abrí `http://localhost:5173`.

## Endpoints del backend

- `GET /api/teams` — lista de los equipos de la Premier League (id, nombre, escudo)
- `GET /api/teams/standings` — tabla de posiciones completa
- `GET /api/teams/:id/overview` — info del equipo + próximo partido + racha + goleador + historial vs el próximo rival

## Notas sobre el plan free de football-data.org

- 10 requests por minuto.
- Solo cubre la temporada actual/reciente.
- Si ves el error "Se alcanzó el límite de requests...", esperá un minuto:
  el cache del backend hace que esto sea raro salvo que cambies de equipo
  muy seguido en pocos segundos.

## Próximos pasos posibles

- Guardar el equipo favorito en localStorage y abrir la app ya con ese seleccionado.
- Filtros por jornada o por rango de fechas en el historial cabeza a cabeza.
- Mostrar la posición del equipo directamente en el header del resumen.
