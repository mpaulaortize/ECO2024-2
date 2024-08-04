document.getElementById("fetch-button").addEventListener("click", fetchData);

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch("https://randomuser.me/api/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    renderErrorState();
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data

  // Extract user data
  const user = data.results[0];
  const { picture, name, email } = user;

  // Create a card to hold the user info
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${picture.large}" alt="User Photo">
    <p><strong>Name:</strong> ${name.first} ${name.last}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;
  container.appendChild(card);
}
