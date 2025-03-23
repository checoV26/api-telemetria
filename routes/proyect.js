const express = require("express");
const db = require("../config/config");
const logger = require("../logger"); // Importar logger

const router = express.Router();

// Middleware para obtener el sessionId desde el token (esto debe estar en un middleware de autenticación)
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Token no válido" });
  }

  req.sessionId = req.user.sessionId; // Asignar sessionId al request
  next();
});

// Obtener lista de proyectos (Protegida)
router.get("/listProyects", (req, res) => {
  const userId = req.query.id; // Recuperar el parámetro 'id' de la cadena de consulta
  if (!userId) {
    return res.status(400).json({ error: "Cliente requerido" });
  }

  const log = logger(req.sessionId); // Crear un logger para esta sesión
  log.info(`Consultando proyectos para el usuario ID: ${userId}`);
  db.query(
    "SELECT Id,Nombre_Obra FROM Obras WHERE Id_Cliente=? AND Status='A'",
    [userId],
    (err, results) => {
      if (err) {
        log.error(`Error al consultar proyectos: ${err.message}`);
        return res.status(500).json({ error: err.message });
      }

      log.info(`Proyectos consultados con éxito: ${results.length}`);
      if (results.length == 0) {
        return res.status(404).json({ error: "No se encontraron proyectos" });
      }
      res.status(200).json({ data: results });
    }
  );
});

module.exports = router;
