import "dotenv/config";
import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams.js";

const app = express();

if (!process.env.FOOTBALL_DATA_API_KEY) {
  console.warn(
    "⚠️ Falta FOOTBALL_DATA_API_KEY en las variables de entorno."
  );
}

// Permitir peticiones desde tu frontend en Vercel o en local
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

app.use(express.json());

// Middleware para que Vercel aplique caché CDN a las respuestas de la API
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
  next();
});

// Rutas
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/teams", teamsRouter);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Error interno" });
});

// Solo escucha en un puerto si se ejecuta localmente
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportación en sintaxis ES Modules (compatible con tus 'import')
export default app;