import express from "express";

import authRoutes from "./authRoutes.js";
import blogRoutes from "./blogRoutes.js";

const router = express.Router();

// Creacion de rutas

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de blogs
router.use("/blogs", blogRoutes);

// export de rutas
export default router;
