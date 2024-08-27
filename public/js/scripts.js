// Event listener para el formulario de registro
document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Recopila los datos del formulario y los convierte en un objeto
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // Realiza una solicitud POST al endpoint /register con los datos del formulario
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Convierte los datos a formato JSON antes de enviarlos
      });

      // Si el registro es exitoso, redirige al usuario a index.html
      if (response.ok) {
        window.location.href = "index.html";
      } else {
        // Si ocurre un error, muestra un mensaje al usuario
        alert("Registration failed. Try a different username.");
      }
    } catch (error) {
      // Captura y muestra cualquier error que ocurra durante la solicitud
      console.error("Error:", error);
    }
  });

// Event listener para el formulario de inicio de sesión
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el envío del formulario

  // Recopila los datos del formulario y los convierte en un objeto
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    // Realiza una solicitud POST al endpoint /login con los datos del formulario
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // Convierte los datos a formato JSON antes de enviarlos
    });

    // Si el inicio de sesión es exitoso, almacena el token en el localStorage
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token); // Guarda el token para autenticaciones futuras
      window.location.href = "create-post.html"; // Redirige a la página de creación de posts
    } else {
      // Si ocurre un error, muestra un mensaje al usuario
      alert("Login failed. Check your username and password.");
    }
  } catch (error) {
    // Captura y muestra cualquier error que ocurra durante la solicitud
    console.error("Error:", error);
  }
});

// Event listener para el formulario de creación de posts
document
  .getElementById("createPostForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el envío del formulario

    // Recopila los datos del formulario y los convierte en un objeto
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // Recupera el token almacenado en localStorage para autenticar la solicitud
      const token = localStorage.getItem("token");

      // Realiza una solicitud POST al endpoint /create-post con los datos del formulario y el token
      const response = await fetch("/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado de autorización
        },
        body: JSON.stringify(data), // Convierte los datos a formato JSON antes de enviarlos
      });

      // Si el post se crea con éxito, muestra un mensaje y reinicia el formulario
      if (response.ok) {
        alert("Post created successfully!");
        e.target.reset(); // Limpia los campos del formulario
      } else {
        // Si ocurre un error, muestra un mensaje al usuario
        alert("Failed to create post.");
      }
    } catch (error) {
      // Captura y muestra cualquier error que ocurra durante la solicitud
      console.error("Error:", error);
    }
  });
