import Blog from "../models/blogModel.js";
import validator from "validator";

//* Validar campos del blog antes de crearlo
export const validarBlog = async (req, res, next) => {
  const { titulo, contenido, categoria } = req.body;

  try {
    // Validar que el título no esté vacío
    if (validator.isEmpty(titulo)) {
      return res
        .status(400)
        .json({ mensaje: "El título no puede estar vacío" });
    }

    // Validar que el contenido no esté vacío
    if (validator.isEmpty(contenido)) {
      return res
        .status(400)
        .json({ mensaje: "El contenido no puede estar vacío" });
    }

    // Validar que la categoría no esté vacía
    if (validator.isEmpty(categoria)) {
      return res
        .status(400)
        .json({ mensaje: "La categoría no puede estar vacía" });
    }

    next();
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

//* Verificar roles para validar creación de blog
export const verificarRoles = async (req, res, next) => {
  try {
    if (req.user.rol !== "personal" && req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para realizar esta acción" });
    }

    next();
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

//* Verificar si el blog existe y si el usuario tiene permiso para actualizarlo o eliminarlo
export const validarBlogExistente = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Verificar si el blog existe
    if (!blog) {
      return res.status(404).json({ mensaje: "Blog no encontrado" });
    }

    // Verificar que el usuario sea el autor del blog o un administrador
    if (
      req.user._id.toString() !== blog.autor.toString() &&
      req.user.rol !== "admin"
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para realizar esta acción" });
    }

    req.blog = blog;
    next();
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
