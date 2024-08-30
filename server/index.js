const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const db = {
  players: [],
};

// Ruta GET para obtener todos los jugadores
app.get("/users", (request, response) => {
  response.send(db);
});

// Ruta POST para agregar un nuevo jugador
app.post("/player", (request, response) => {
  const { body } = request;
  const { name, choice } = body;

  if (!name || !choice) {
    return response.status(400).send({ error: "Name and choice are required" });
  }

  const validChoices = ["piedra", "papel", "tijera"];
  if (!validChoices.includes(choice)) {
    return response.status(400).send({ error: "Invalid choice" });
  }

  // Agregar el jugador a la base de datos
  db.players.push(body);

  // Emitir evento a todos los clientes conectados
  io.emit("playerChosen", body);

  response.status(201).send(body);
});

// Configurar el servidor de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar el servidor
server.listen(5050, () => {
  console.log(`Server is running on http://localhost:5050`);
});
