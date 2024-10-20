import Mensaje from "../../models/mensajesModel";

const chatController = (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado");

    // Obtener mensaje del cliente al conectarse
    (async () => {
      try {
        const mensajesPrevios = await Mensaje.find({
          $or: [{ remitente: socket.id }, { destinatario: socket.id }], // Buscar mensajes donde el remitente o el destinatario sea el ID del socket
        })
          .sort({ fecha: -1 }) // Ordenar por fecha (mas reciente primero)
          .limit(10); // Limitar a 10 mensajes
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    })();

    socket.on("message", async (msg) => {
      try {
        // Guardar mensaje en la base de datos
        const nuevoMensaje = new Mensaje({
          remitente: msg.remitente,
          destinatario: msg.destinatario,
          contenido: msg.contenido,
        });
        await nuevoMensaje.save();

        // Emite el mensaje a los usuarios involucrados en el chat
        io.to(message.remitente).emit("message", nuevoMensaje);
        io.to(message.destinatario).emit("message", nuevoMensaje);
      } catch (error) {
        console.error("Error al guardar mensaje:", error);
        socket.emit("error", "Lo siento, hubo un error al guardar tu mensaje");
      }
    });
  });
};

export default chatController;
