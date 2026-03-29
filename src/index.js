import express from "express"
import cors from "cors"
import { pool } from "./db/config.js"
import authRoutes from "./routes/auth.routes.js"
import gamesRoutes from "./routes/games.routes.js"

// Función para crear las tablas automáticamente
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS juegos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        imagen TEXT,
        descripcion TEXT
      );
    `);
    console.log("✅ Tablas verificadas/creadas");
  } catch (error) {
    console.error("❌ Error al inicializar DB:", error);
  }
};

initDB(); // Ejecutar al arrancar el servidor

const app = express()

app.use(cors({
  origin: "*", // Permite peticiones de cualquier origen (Netlify)
  allowedHeaders: ["Content-Type", "Authorization"] // Vital para que pase el token
}));
app.use(express.json()) 

app.use("/auth", authRoutes)
app.use("/games", gamesRoutes)

app.get("/", (req, res) => {
  res.send("API funcionando 🚀")
})

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json(result.rows)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

const PORT = process.env.PORT || 3000; // Toma el puerto de Render o usa 3000 localmente
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});