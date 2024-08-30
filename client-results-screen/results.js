// results.js
document.getElementById("fetch-button").addEventListener("click", fetchData);

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:5050/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(error);
    renderErrorState();
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";

  if (data.players.length === 0) {
    container.innerHTML = "<p>Esperando jugadores...</p>";
    return;
  }

  if (data.players.length >= 2) {
    const lastPlayer = data.players[data.players.length - 1];
    const secondLastPlayer = data.players[data.players.length - 2];

    const result = determineWinner(lastPlayer, secondLastPlayer);

    const matchResultDiv = document.createElement("div");
    matchResultDiv.className = "result";
    matchResultDiv.innerHTML = `
      <div class="player-info">
        <img src="https://tiermaker.com/images/template_images/2022/16109530/kahoot-character-teir-list-16109530/screenshot-2023-08-28-094307.png" alt="Player 1">
        <p>${secondLastPlayer.name} (${secondLastPlayer.choice})</p>
      </div>
      <div class="player-info">
        <img src="https://tiermaker.com/images/template_images/2022/16109530/kahoot-character-teir-list-16109530/screenshot-2023-08-28-094303.png" alt="Player 2">
        <p>${lastPlayer.name} (${lastPlayer.choice})</p>
      </div>
      <p>🏆 Ganador: ${result}</p>
    `;
    container.appendChild(matchResultDiv);
  } else {
    container.innerHTML = "<p>Esperando jugadores...</p>";
  }
}

function determineWinner(player1, player2) {
  if (player1.choice === player2.choice) {
    return "Empate";
  }
  if (
    (player1.choice === "piedra" && player2.choice === "tijera") ||
    (player1.choice === "tijera" && player2.choice === "papel") ||
    (player1.choice === "papel" && player2.choice === "piedra")
  ) {
    return player1.name;
  } else {
    return player2.name;
  }
}
