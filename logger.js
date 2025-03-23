const winston = require("winston");
const path = require("path");

module.exports = (sessionId) => {
  const logFilePath = path.join(__dirname, "logs", `${sessionId}.log`);

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: logFilePath }),
      new winston.transports.Console({ format: winston.format.simple() }),
    ],
  });
};
