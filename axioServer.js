import express from "express";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import axios from "axios";
import _ from "lodash";

const app = express();
const port = 3000;
const intervalo = setInterval(obtenerUsuarioAleatorio, 10000);
let usuariosRegistrados = [];

// Configurar un tiempo máximo para detener la generación después de 1 minuto
const tiempoMaximo = 60000;
setTimeout(() => {
  clearInterval(intervalo);
  console.log("Tiempo máximo alcanzado. Generación de usuarios detenida");
}, tiempoMaximo);

obtenerUsuarioAleatorio();

// Función para obtener datos de un usuario aleatorio desde la API Random User
async function obtenerUsuarioAleatorio() {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    const usuario = response.data.results[0];

    // Crear un objeto con los detalles del usuario
    const nuevoUsuario = {
      gender: usuario.gender,
      id: uuidv4(),
      nombre: usuario.name.first,
      apellido: usuario.name.last,
      fechaRegistro: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    // Agregar el nuevo usuario a la lista
    usuariosRegistrados.push(nuevoUsuario);

    // Imprimir los detalles del usuario por consola
    console.log(chalk.bgWhite.blue("Nuevo Usuario Registrado:"));
    console.log(chalk.bgWhite.blue("Género: " + nuevoUsuario.gender));
    console.log(chalk.bgWhite.blue("Nombre: " + nuevoUsuario.nombre));
    console.log(chalk.bgWhite.blue("Apellido: " + nuevoUsuario.apellido));
    console.log(chalk.bgWhite.blue("ID único: " + nuevoUsuario.id));
    console.log(
      chalk.bgWhite.blue(
        "Fecha y Hora de Registro: " + nuevoUsuario.fechaRegistro
      )
    );
  } catch (error) {
    console.error("Error al obtener usuario aleatorio:", error);
  }
}

// Configurar una ruta para mostrar los datos en HTML
app.get("/", (req, res) => {
  // Obtener el último usuario registrado
  const ultimoUsuario = usuariosRegistrados[usuariosRegistrados.length - 1];

  // Renderizar una plantilla HTML con los detalles del último usuario
  const html = `
        <html>
            <head>
                <title>Último Usuario Registrado🏥</title>
                    <!-- CDN de Pico.css -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
    />
                <link rel="stylesheet" href="styles.css">
       
            </head>
            <body>
                <main class="container">
                    <div class="card">
                        <h1>Último Usuario Registrado</h1>
                        <div class="usuario-info">
                            <p><strong>Nombre:</strong> ${ultimoUsuario.nombre}</p>
                            <p><strong>Apellido:</strong> ${ultimoUsuario.apellido}</p>
                            <p><strong>ID único:</strong> ${ultimoUsuario.id}</p>
                            <p><strong>Fecha y Hora de Registro:</strong> ${ultimoUsuario.fechaRegistro}</p>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    `;
  res.send(html);
});

//devuelve lista separado por genero
app.get("/:usuarios", (req, res) => {
  // Agrupa los usuarios por género utilizando Lodash
  const pacientesPorGenero = _.groupBy(usuariosRegistrados, (usuario) => {
    return usuario.gender; // Utilizar la propiedad gender
  });

  res.json(pacientesPorGenero);
});

app.get("*", (req, res) => {
  // Paso 2
  res.send("<center><h1>Sorry, aquí no hay nada :/ </h1></center>");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
