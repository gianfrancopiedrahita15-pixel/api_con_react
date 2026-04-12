import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica que exista un token Bearer antes de permitir acceso a rutas privadas.
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    // Decodifica el JWT y busca el usuario autenticado sin exponer su password.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    next();
  } catch {
    // Cualquier fallo de verificacion invalida el acceso al recurso protegido.
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
};
