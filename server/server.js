import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Carga variables de entorno antes de iniciar el servidor.
dotenv.config();

const PORT = process.env.PORT || 4000;

// Intenta conectar Mongo y luego levanta Express para aceptar peticiones.
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
