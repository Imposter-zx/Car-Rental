import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import configRoutes from './routes/configRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 images
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/config', configRoutes);

// Root route & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API Gamil Rent Car Production Server',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbState: mongoose.connection.readyState,
    version: '1.0.0'
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERREUR: MONGODB_URI n’est pas défini');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch(err => {
      console.error('CRITICAL: Erreur de connexion initiale MongoDB:', err.message);
    });
}

mongoose.connection.on('error', err => {
  console.error('CRITICAL: Erreur Mongoose en cours d’exécution:', err);
});

// App configuration and startup
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

export default app;
