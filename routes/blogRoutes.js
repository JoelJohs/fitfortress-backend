import express from "express";
import {
  obtenerBlogs,
  obtenerBlogPorId,
  crearBlog,
  actualizarBlog,
  eliminarBlog,
} from "../controllers/blogController.js";

import {
  validarBlog,
  verificarRoles,
  validarBlogExistente,
} from "../middlewares/blogMiddleware.js";

const router = express.Router();

router.get("/", obtenerBlogs);
router.get("/:id", obtenerBlogPorId);
router.post("/", validarBlog, verificarRoles, crearBlog);
router.put(
  "/:id",
  validarBlog,
  verificarRoles,
  validarBlogExistente,
  actualizarBlog
);

router.delete("/:id", verificarRoles, validarBlogExistente, eliminarBlog);

export default router;
