import Blog from "../models/blogModel.js";

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
    // Verificar que el rol del usuario ("Personal" o "Admin") sea valido para crear un blog
    if (req.usuario.rol !== "Personal" && req.usuario.rol !== "Admin") {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para crear un blog" });
    }

    const nuevoBlog = new Blog({ ...req.body, autor: req.usuario._id }); // Crear un nuevo blog con el cuerpo de la solicitud y el ID del autor
    const blogGuardado = await nuevoBlog.save();
    res.status(201).json(blogGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el blog" });
  }
};

//* Actualizar un blog
export const actualizarBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Verificar si el blog existe
    if (!blog) {
      return res.status(404).json({ mensaje: "Blog no encontrado" });
    }

    // Verificar que el usuario sea el autor del blog o un administrador
    if (
      req.usuario._id.toString() !== blog.autor.toString() &&
      req.usuario.rol !== "Admin"
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para actualizar este blog" });
    }

    const blogActualizado = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(blogActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el blog" });
  }
};
