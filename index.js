const express = require("express"); // Importa el framework Express
const fs = require("fs"); // Importa el módulo del sistema de archivos (File System)
const path = require("path"); // Importa el módulo para trabajar con rutas de archivos
const app = express(); // Inicializa una aplicación Express

// Configuración para que la aplicación use JSON y URL encoding
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos codificados en URL
app.use(express.static(path.join(__dirname, "../public"))); // Sirve archivos estáticos desde la carpeta "public"

// Definición de rutas a los archivos de datos (usuarios y posts)
const usersFilePath = path.join(__dirname, "data", "users.json"); // Ruta al archivo de usuarios
const postsFilePath = path.join(__dirname, "data", "posts.json"); // Ruta al archivo de posts

// Funciones Helper para leer y escribir datos en archivos

// Guarda datos en el archivo especificado
function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Escribe los datos en formato JSON en el archivo
}

// Carga datos desde el archivo especificado
function loadData(filePath) {
  return JSON.parse(fs.readFileSync(filePath)); // Lee y convierte el contenido del archivo a un objeto JSON
}

// Endpoint de registro de usuarios
app.post("/register", (req, res) => {
  const { username, name, password } = req.body; // Desestructura los datos del cuerpo de la solicitud
  const users = loadData(usersFilePath); // Carga los usuarios existentes desde el archivo

  // Verifica si el usuario ya existe
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    // Si el usuario ya existe, responde con un error 400
    return res.status(400).json({ message: "User already exists" });
  }

  // Crea un nuevo usuario y lo añade a la lista de usuarios
  const newUser = { username, name, password };
  users.push(newUser);
  saveData(usersFilePath, users); // Guarda la lista de usuarios actualizada

  // Responde con éxito en el registro del usuario
  res.status(201).json({ message: "User registered successfully" });
});

// Endpoint de login
app.post("/login", (req, res) => {
  const { username, password } = req.body; // Desestructura los datos del cuerpo de la solicitud
  const users = loadData(usersFilePath); // Carga los usuarios existentes desde el archivo

  // Busca al usuario con el username y password proporcionados
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    // Si no se encuentra el usuario, responde con un error 400
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Si el login es exitoso, responde con un mensaje de éxito
  res.status(200).json({ message: "Login successful" });
});

// Endpoint para crear posts
app.post("/create-post", (req, res) => {
  const { title, description, imageUrl } = req.body; // Desestructura los datos del cuerpo de la solicitud
  const posts = loadData(postsFilePath); // Carga los posts existentes desde el archivo

  // Crea un nuevo post con los datos proporcionados y añade una fecha de creación
  const newPost = {
    title,
    description,
    imageUrl,
    date: new Date().toISOString(), // Añade la fecha actual en formato ISO
  };
  posts.push(newPost); // Añade el nuevo post a la lista de posts
  saveData(postsFilePath, posts); // Guarda la lista de posts actualizada

  // Responde con éxito en la creación del post
  res.status(201).json({ message: "Post created successfully" });
});

// Inicia el servidor en el puerto 3000 y muestra un mensaje en la consola
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
