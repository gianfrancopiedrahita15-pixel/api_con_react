import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return true;
    }
    // Abre la conexion principal hacia MongoDB Atlas con un timeout razonable.
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('MongoDB conectado');
  } catch (error) {
    // Muestra el motivo del fallo y deja pistas cuando el problema parece de red o DNS.
    console.error('Error conectando a MongoDB:', error.message);
    if (
      error.message.includes('querySrv') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED')
    ) {
      console.error(
        'Atlas no respondio por DNS/red. Revisa Network Access en Mongo Atlas, la URI del cluster y tu conexion a internet.',
      );
    }
    return false;
  }
};

// Permite saber desde cualquier parte del backend si Mongo ya esta disponible.
export const isDatabaseReady = () => mongoose.connection.readyState === 1;
