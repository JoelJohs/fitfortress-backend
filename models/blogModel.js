import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
  },
  fechaCreacion: { type: Date, default: Date.now },
  tipoAcceso: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },
  categoria: { type: String, required: true },
  etiquetas: [String],
  imagen: String,
  vistas: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
