import express from "express";
import multer from "multer";
import {
  obtenerBlogs,
  obtenerBlogPorId,
  crearBlog,
  actualizarBlog,
  eliminarBlog,
  obtenerBlogsPorUsername,
} from "../controllers/blogController.js";

import {
  validarBlog,
  verificarRoles,
  validarBlogExistente,
} from "../middlewares/blogMiddleware.js";

import { roleMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Configuración de multer

router.get("/", obtenerBlogs);
router.get("/:id", obtenerBlogPorId);
router.get("/author/:username", obtenerBlogsPorUsername);
router.post(
  "/",
  upload.single("imagen"),
  roleMiddleware,
  validarBlog,
  verificarRoles,
  crearBlog
);
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
