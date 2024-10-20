import express from "express";
import {
  register,
  login,
  logout,
  protectedRoute,
} from "../controllers/authController.js";

import {
  registerMiddleware,
  loginMiddleware,
  tokenMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginMiddleware, login);

router.post("/register", registerMiddleware, register);

router.post("/logout", logout);

router.get("/protected", tokenMiddleware, protectedRoute);

export default router;
