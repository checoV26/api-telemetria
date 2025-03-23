require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

// Importar rutas
const authRoutes = require("./routes/auth");
const userProyect = require("./routes/proyect");

app.use("/api/auth", authRoutes);
app.use("/api/proyect", authMiddleware, userProyect);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
