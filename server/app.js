import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { isDatabaseReady } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS?.split(',').map((origin) => origin.trim()) || []),
].filter(Boolean);

// Habilita CORS para que el frontend pueda consumir la API desde Vite.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  }),
);

// Permite leer JSON enviado desde formularios y peticiones Axios.
app.use(express.json());

// Endpoint simple para comprobar si la API y la conexion a Mongo estan vivas.
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'Backend de SIS Gastos activo',
    health: '/api/health',
  });
});

// Endpoint simple para comprobar si la API y la conexion a Mongo estan vivas.
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'API de gastos activa',
    database: isDatabaseReady() ? 'connected' : 'disconnected',
    storage: 'mongo',
  });
});

// Rutas agrupadas por dominio: autenticacion y gastos.
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Captura cualquier ruta inexistente y devuelve un error controlado.
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;
