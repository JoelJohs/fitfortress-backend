import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

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
    const hashedPassword = await bcrypt.hash(password, 10);
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

//* Middleware para verificar roles
//* Verifica si el usuario tiene el rol necesario para realizar una acción
export const roleMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token; // Obtener el token de las cookies

    if (!token) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para realizar esta acción" });
    }

    // Verificar y decodificar el token para obtener el id y rol del usuario
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar id y rol del usuario
    const userId = decodedToken.id;
    const username = decodedToken.username;
    const userRole = decodedToken.rol;

    // Buscar el usuario en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Asignar el rol del usuario a la solicitud
    req.user = {
      _id: userId,
      username: username,
      rol: userRole,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ mensaje: "Token inválido." });
    }
    res.status(500).json({ mensaje: "Error de autenticación." });
  }
};
