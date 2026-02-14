import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 images
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API Gamil Rent Car en cours d’exécution...');
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERREUR: MONGODB_URI n’est pas défini');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err.message));
}

// Only listen if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

export default app;
