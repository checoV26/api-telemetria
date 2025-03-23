const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "secreto123";

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // El token suele ir en el encabezado 'Authorization'
  //console.log("Token recuperado: ", token);
  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY); // Extraer el token después de 'Bearer'
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token no válido" });
  }
};

module.exports = authMiddleware;
