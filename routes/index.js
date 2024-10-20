import express from "express";

import authRoutes from "./authRoutes.js";

const router = express.Router();

// Creacion de rutas

// Rutas de autenticación
router.use("/auth", authRoutes);

export default router;
