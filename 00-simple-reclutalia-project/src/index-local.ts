import app from "./app";
import * as dotenv from "dotenv";
const http = require("http");

dotenv.config();

const server = http.createServer(app);

// Establecer un timeout de 0 (sin límite) para el servidor HTTP
server.setTimeout(5000); // El servidor no tendrá límite de tiempo para las respuestas

app.listen(8002, () => {
  console.log("http://localhost:8002");
});

module.exports = app;
