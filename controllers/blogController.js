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
    const nuevoBlog = new Blog({
      ...req.body,
      autor: { _id: req.user._id, username: req.user.username },
    }); // Crear un nuevo blog con el cuerpo de la solicitud y el ID del autor

    const blogGuardado = await nuevoBlog.save();

    res.status(201).json(blogGuardado);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el blog", error: error.message });
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
