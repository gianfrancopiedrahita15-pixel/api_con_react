import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Da formato uniforme al usuario antes de devolverlo al frontend.
const normalizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const registerUser = async (req, res) => {
  try {
    // Extrae y valida los datos basicos del formulario de registro.
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya esta registrado' });
    }

    // Hashea la contrasena antes de guardarla y responde con JWT listo para usar.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registro exitoso',
      token: generateToken(user._id.toString()),
      user: normalizeUser(user),
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({ message: 'No se pudo registrar el usuario' });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Valida credenciales y compara la contrasena recibida con la almacenada.
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contrasena son obligatorios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    // Si la autenticacion es correcta, devuelve token y datos basicos del usuario.
    return res.json({
      message: 'Inicio de sesion exitoso',
      token: generateToken(user._id.toString()),
      user: normalizeUser(user),
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    return res.status(500).json({ message: 'No se pudo iniciar sesion' });
  }
};

// Devuelve el perfil del usuario autenticado obtenido desde el middleware protect.
export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};
