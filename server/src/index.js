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
