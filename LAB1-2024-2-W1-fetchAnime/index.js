// Asignamos eventos a los botones de búsqueda y limpiar
document.getElementById("search-button").addEventListener("click", fetchData);
document.getElementById("clear-button").addEventListener("click", clearData);

async function fetchData() {
  renderLoadingState(); // Mostramos un estado de carga mientras obtenemos los datos

  // Obtenemos los valores de los campos de búsqueda y tipo
  const search = document.getElementById("search").value;
  const type = document.getElementById("type").value;

  try {
    // Realizamos la solicitud a la API de Jikan con los parámetros de búsqueda y tipo
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${search}&type=${type}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Manejamos errores de red
    }
    const data = await response.json(); // Convertimos la respuesta a JSON
    renderData(data); // Mostramos los datos obtenidos
  } catch (error) {
    renderErrorState(); // Mostramos un estado de error en caso de fallo
  }
}

function clearData() {
  // Limpiamos los campos de entrada y los contenedores de resultados
  document.getElementById("search").value = "";
  document.getElementById("type").value = "";
  const container = document.getElementById("data-container");
  const resultCount = document.getElementById("result-count");
  container.innerHTML = "";
  resultCount.innerHTML = "";
}

function renderErrorState() {
  // Limpiamos los contenedores y mostramos un mensaje de error
  const container = document.getElementById("data-container");
  const resultCount = document.getElementById("result-count");
  container.innerHTML = ""; // Limpiamos datos anteriores
  resultCount.innerHTML = ""; // Limpiamos el conteo de resultados
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  // Limpiamos los contenedores y mostramos un mensaje de "Cargando..."
  const container = document.getElementById("data-container");
  const resultCount = document.getElementById("result-count");
  container.innerHTML = ""; // Limpiamos datos anteriores
  resultCount.innerHTML = ""; // Limpiamos el conteo de resultados
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(data) {
  // Limpiamos el contenedor de datos
  const container = document.getElementById("data-container");
  const resultCount = document.getElementById("result-count");
  container.innerHTML = ""; // Limpiamos datos anteriores

  // Mostramos el número total de resultados encontrados
  resultCount.innerHTML = `<p>Found ${data.pagination.items.total} results</p>`;

  // Recorremos los resultados y creamos elementos HTML para cada anime
  data.data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h2>${item.title}</h2>
      <img src="${item.images.jpg.image_url}" alt="${item.title}">
      <p>Type: ${item.type}</p>
      <p>Score: ${item.score}</p>
    `;
    container.appendChild(div); // Añadimos el elemento al contenedor
  });
}
