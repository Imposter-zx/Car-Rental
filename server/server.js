import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import configRoutes from './routes/configRoutes.js';

dotenv.config();

// Database connection middleware (Required for Serverless/Vercel)
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) return next();
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      const availableKeys = Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('URI'));
      console.error('ERREUR: MONGODB_URI n’est pas défini. Clés trouvées:', availableKeys);
      return res.status(500).json({ 
        message: 'Configuration de la base de données manquante',
        hint: `Vérifiez votre dashboard Vercel. Clés détectées: ${availableKeys.join(', ') || 'Aucune'}`
      });
    }
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable buffering for better serverless error reporting
    });
    console.log('Connexion MongoDB établie à la volée');
    next();
  } catch (error) {
    console.error('CRITICAL: Échec de la connexion à la volée:', error.message);
    res.status(500).json({ message: 'Échec de connexion à la base de données', detail: error.message });
  }
};

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(connectDB); // Ensure DB is connected for every request

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

// Mongoose specific logging
mongoose.connection.on('error', err => {
  console.error('CRITICAL: Erreur Mongoose:', err);
});

// App configuration and startup
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

export default app;
