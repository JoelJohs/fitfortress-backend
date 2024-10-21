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
import connectDB from "./config/db.js";

//* CONFIGURACION BASICA DE EXPRESS
// ************************************

//* Creación de la aplicación
// Se crea la aplicación de express y se integran todas las configuraciones necesarias
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

//* Carga de variables de entorno
dotenv.config();
//* Extraccion de variables de entorno
// Definición del puerto
const PORT = process.env.PORT || 3000;
// Mongo Uri
const mongoUri = process.env.MONGODB_URI;

// Conexión a la base de datos
connectDB(mongoUri);

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
