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

import { roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", obtenerBlogs);
router.get("/:id", obtenerBlogPorId);
router.post("/", roleMiddleware, validarBlog, verificarRoles, crearBlog);
router.put(
  "/:id",
  roleMiddleware,
  validarBlog,
  verificarRoles,
  validarBlogExistente,
  actualizarBlog
);

router.delete(
  "/:id",
  roleMiddleware,
  verificarRoles,
  validarBlogExistente,
  eliminarBlog
);

export default router;
