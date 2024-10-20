import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
  remitente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID del usuario que envía el mensaje
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID del usuario que recibe el mensaje
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const Mensaje = mongoose.model("Mensajes", mensajeSchema);
export default Mensaje;
