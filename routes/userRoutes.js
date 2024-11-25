import express from "express";
import {
  getUsers,
  getUserById,
  getUserByUsername,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserByUsername);
router.get("/:id", getUserById);

export default router;
