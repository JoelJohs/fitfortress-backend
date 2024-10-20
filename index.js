// Imports de dependencias y configuraciones básicas para el servidor
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import colors from "colors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

// Importación de controladores
import chatController from "./controllers/chatControllers/chatController.js";

import router from "./routes/index.js";

// CONFIGURACION BASICA DE EXPRESS
// ************************************

// Definición del puerto
const PORT = process.env.PORT || 3000;

// Creación de la aplicación
const app = express();
const server = createServer(app); // Servidor HTTP
const io = new Server(server); // Socket.io - Websockets server

// Configuraciones de express
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/", router);

// Carga de variables de entorno
dotenv.config();

// Conexión a la base de datos
const mongoUri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoUri, {})
  .then(() => {
    console.log(colors.green.bold("Connected to MongoDB"));
  })
  .catch((error) => {
    console.log(colors.red.bold("Error connecting to MongoDB: ", error));
  });

// OTRAS CONFIGURACIONES
// ************************************

// Configuración de Websockets
chatController(io); // Se inicia el controlador de chat

//* Inicialización del servidor
// Se cambia app.listen por server.listen para que funcione con socket.io y express al mismo tiempo

server.listen(PORT, () => {
  console.log(
    colors.green.bold(`Servidor iniciado en http://localhost:${PORT}`)
  );
});
