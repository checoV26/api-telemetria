const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/config");
const logger = require("../logger");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "secreto123";

// Login
router.post("/login", (req, res) => {
  const { userName, pass } = req.body;

  if (!userName || !pass) {
    return res.status(400).json({ error: "User y password requeridos" });
  }

  db.query(
    "SELECT id, nameUser, pass, idCliente,perfil FROM userCliente WHERE nameUser = ? and status='A'",
    [userName],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const usuario = results[0];

      bcrypt.compare(pass, usuario.pass, (err, match) => {
        if (err) return res.status(500).json({ error: "Error en validación" });
        if (!match) {
          return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const sessionId = `session-${usuario.id}-${Date.now()}`;
        const token = jwt.sign({ id: usuario.id, sessionId }, SECRET_KEY, {
          expiresIn: "1h",
        });

        // Crear el logger para esta sesión
        const log = logger(sessionId);
        log.info("Inicio de sesión exitoso");

        res.status(200).json({
          message: "Login exitoso",
          idCliente: usuario.idCliente,
          perfil: usuario.perfil,
          token,
          sessionId,
        });
      });
    }
  );
});

module.exports = router;
