import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { isDatabaseReady } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();

const app = express();

// Habilita CORS para que el frontend pueda consumir la API desde Vite.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);

// Permite leer JSON enviado desde formularios y peticiones Axios.
app.use(express.json());

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
