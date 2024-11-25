import Blog from "../models/blogModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

//* Obtener todos los blogs con paginación
export const obtenerBlogs = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1; // Página actual (por defecto 1)
    const limite = parseInt(req.query.limite) || 10; // Número de blogs por página (por defecto 10)

    const skip = (pagina - 1) * limite; // Calcular el número de blogs a saltar

    const blogs = await Blog.find()
      .sort({ fecha: -1 }) // Ordenar por fecha descendente
      .skip(skip) // Saltar blogs
      .limit(limite); // Limitar blogs

    const totalBlogs = await Blog.countDocuments(); // Contar el total de blogs

    res.json({
      blogs, // Enviar blogs
      paginaActual: pagina, // Enviar página actual
      totalPaginas: Math.ceil(totalBlogs / limite), // Enviar total de páginas
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los blogs" });
  }
};

//* Obtener un blog por ID
export const obtenerBlogPorId = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ mensaje: "Blog no encontrado" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el blog" });
  }
};

//* Crear un blog
export const crearBlog = async (req, res) => {
  try {
    const { titulo, contenido, categoria } = req.body;
    const { file } = req;

    // Verificar que req.body y req.file no sean undefined
    if (!titulo || !contenido || !categoria) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos en el cuerpo de la solicitud" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ mensaje: "No se ha subido ningún archivo" });
    }

    const { path } = file; // Ruta del archivo subido

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(path, {
      public_id: `blog/${titulo.replace(/\s+/g, "_")}_${Date.now()}`,
      folder: "blogs",
      resource_type: "image",
    });

    // Eliminar el archivo local después de subirlo a Cloudinary
    fs.unlinkSync(path);

    const nuevoBlog = new Blog({
      titulo,
      contenido,
      categoria,
      autor: { _id: req.user._id, username: req.user.username },
      imagen: result.secure_url, // Guardar la URL de la imagen
    });

    const blogGuardado = await nuevoBlog.save();

    res.status(201).json(blogGuardado);
  } catch (error) {
    console.error(error); // Log del error para depuración
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//* Obtener blogs por nombre de usuario
export const obtenerBlogsPorUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const blogs = await Blog.find({ "autor.username": username });

    if (!blogs.length) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron blogs para este usuario" });
    }

    res.json({ blogs });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los blogs por nombre de usuario" });
  }
};

//* Actualizar un blog
export const actualizarBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ mensaje: "Blog no encontrado", error: error.message });
    }

    const blogActualizado = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(blogActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el blog", error: error.message });
  }
};

//* Eliminar un blog (solo para el autor o admin)
export const eliminarBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Blog eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el blog" });
  }
};
