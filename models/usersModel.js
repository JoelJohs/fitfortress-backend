import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ["admin", "user", "personal"],
    default: "user",
  },
  tipoCuenta: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },
  fechaNacimiento: Date,
  genero: { type: String, enum: ["masculino", "femenino", "otro"] },

  // Imagen de perfil
  fotoPerfil: { type: String, default: "uploads/generic.png" },

  fechaRegistro: { type: Date, default: Date.now },
});

const User = mongoose.model("Users", userSchema);
export default User;
