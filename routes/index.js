import express from "express";

import authRoutes from "./authRoutes.js";
import blogRoutes from "./blogRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Creacion de rutas

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de blogs
router.use("/blogs", blogRoutes);

// Rutas de usuarios
router.use("/users", userRoutes);

// export de rutas
export default router;
