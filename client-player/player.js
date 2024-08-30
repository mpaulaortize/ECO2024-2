// Conectar al servidor Socket.IO
const socket = io("http://localhost:5050");

document.getElementById("fetch-button").addEventListener("click", createUser);

// Aquí estoy creando el usuario
async function createUser() {
  const playerName = document.getElementById("player-name").value;
  const selectedButton = document.querySelector(".icons button.selected");
  const playerChoice = selectedButton
    ? selectedButton.getAttribute("data-move")
    : "";

  if (!playerName || !playerChoice) {
    alert("Ingresa tu nombre y selecciona una opción.");
    renderErrorState("Nombre o elección no válidos.");
    return;
  }

  const player = {
    name: playerName,
    choice: playerChoice,
  };

  try {
    const response = await fetch("http://localhost:5050/player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Emitir un evento al servidor notificando que un jugador ha hecho su elección
    socket.emit("playerChosen", player);

    renderData(player); // Cambiar a pasar el objeto del jugador
  } catch (error) {
    renderErrorState(error.message);
  }
}

// Escuchar cuando otro jugador haya hecho su elección
socket.on("playerChosen", (player) => {
  console.log(`Jugador ${player.name} ha elegido ${player.choice}`);
  updatePlayersRealTime(player);
});

document.querySelectorAll(".icons button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".icons button")
      .forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

function renderErrorState(message) {
  const container = document.getElementById("data-container");
  container.innerHTML = `<p>${message}</p>`;
  console.log("Error:", message);
}

function renderData(player) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";

  // Ajustar el formato del mensaje
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `🔔 El jugador ${player.name} ha elegido ${player.choice}`;
  container.appendChild(div);
}

function updatePlayersRealTime(player) {
  const container = document.getElementById("data-container");

  // Crear el mensaje con el nuevo formato
  const playerInfoDiv = document.createElement("div");
  playerInfoDiv.className = "player-info";
  playerInfoDiv.innerHTML = `
    <p>🔔 El jugador ${player.name} ha elegido</p>
  `;

  container.appendChild(playerInfoDiv);
}
