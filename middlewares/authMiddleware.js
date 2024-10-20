import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const saltRounds = process.env.SALT_ROUNDS || 10;

//* Register middleware
//* Verifica los datos del usuario antes de registrarlo en la base de datos
export const registerMiddleware = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Revisa si el username ya existe
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya existe" });
    }

    // Revisa si el email es un email válido
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "El email introducido no es válido" });
    }

    // Revisa si el email ya existe
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "El email introducido ya existe" });
    }

    // Revise si la contraseña tiene al menos 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres de longitud",
      });
    }

    // Hashea la contraseña antes de guardarla en la base de datos y la guarda en req.body para que el controlador pueda acceder a ella
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Login middleware
//* Verifica las credenciales del usuario
export const loginMiddleware = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Busca el usuario en la base de datos
    const user = await User.findOne({ username });

    // Revisa si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Compara la contraseña introducida con la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Guarda el usuario en req.body para que el controlador pueda acceder a él después
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Middleware que no se para que sirve ni como se usa

export const tokenMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
