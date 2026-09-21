import "dotenv/config";
import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams.js";

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.FOOTBALL_DATA_API_KEY) {
  console.warn(
    "⚠️  Falta FOOTBALL_DATA_API_KEY en tu .env — copiá .env.example a .env y completá tu key."
  );
}

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/teams", teamsRouter);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Error interno" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Ejemplo de endpoint en tu servidor Express:
app.get('/api/teams/overview', async (req, res) => {
  try {
    // Configura la CDN de Vercel para guardar en caché la respuesta durante 60 segundos (s-maxage)
    // stale-while-revalidate permite entregar contenido viejo por 30s mientras renueva el caché en segundo plano.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

    // ... lógica para pedir datos a football-data.org ...
    
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exporta la app para que Vercel la ejecute como Serverless Function
module.exports = app;

// Solo escucha en un puerto si se ejecuta de forma local (fuera de Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}