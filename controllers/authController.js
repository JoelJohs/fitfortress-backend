import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

//* Register
export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    username,
    email,
    password,
    genero,
    fechaNacimiento,
  } = req.body;

  const newUser = new User({
    nombre,
    apellido,
    username,
    email,
    password,
    genero,
    fechaNacimiento,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//* Login
export const login = async (req, res) => {
  const user = req.user;

  // Generar el token de autenticación con JWT
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", //* NO OLVIDAR CAMBIAR A 1H
    }
  );

  // Envía el token en la respuesta
  res
    .cookie("access_token", token, {
      httpOnly: true, // Cookie solo accesible por el servidor
      secure: process.env.NODE_ENV === "production", // Solo se envía en producción (https)
      sameSite: "strict", // Cookie no accesible por terceros, solo por el mismo dominio
      maxAge: 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (1 hora)
    }) // Agregar la cookie al header de la respuesta
    .status(200)
    .json({ token });
};

//* Logout
export const logout = async (req, res) => {
  res.clearCookie("access_token").send("Se ha cerrado la sesión");
};

//* Protected route
export const protectedRoute = async (req, res) => {
  if (req.session.user) {
    res.json({ message: "Acceso concedido", user: req.session.user });
  } else {
    res.status(401).json({ message: "Acceso denegado" });
  }
};
