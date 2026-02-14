import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Car from './models/Car.js';

dotenv.config();

const cars = [
  {
    name: "Dacia Logan",
    category: "Économique",
    transmission: "Manuel",
    fuel: "Diesel",
    price: 300,
    image: "https://images.carprices.com/pricefiles/0/4904/original/2021-dacia-logan.jpg",
    isAvailable: true,
    description: "La voiture familiale préférée pour son économie et sa fiabilité."
  },
  {
    name: "Dacia Sandero Stepway",
    category: "Citadine",
    transmission: "Manuel",
    fuel: "Essence",
    price: 350,
    image: "https://www.largus.fr/images/images/dacia-sandero-stepway-2021-15.jpg",
    isAvailable: true,
    description: "Une citadine robuste avec un style crossover."
  },
  {
    name: "Dacia Duster",
    category: "SUV",
    transmission: "Manuel",
    fuel: "Diesel",
    price: 500,
    image: "https://www.largus.fr/images/images/dacia-duster-2-phase-2-2021-6.jpg",
    isAvailable: true,
    description: "Un SUV polyvalent capable de s'adapter à tous les terrains."
  },
  {
    name: "Volkswagen T-Roc",
    category: "SUV Premium",
    transmission: "Automatique",
    fuel: "Diesel",
    price: 700,
    image: "https://www.volkswagen.co.uk/idhub/dotcom/content/dam/dotcom/en_gb/models/t-roc/t-roc-pa/VWC_80327_T-Roc_R-Line_Kings_Red_1.jpg",
    isAvailable: true,
    description: "Style, performance et confort supérieur."
  },
  {
    name: "Renault Clio 5",
    category: "Citadine",
    transmission: "Manuel",
    fuel: "Diesel",
    price: 400,
    image: "https://cdn.motor1.com/images/mgl/1XmE9/s1/renault-clio-hybrid-2020.jpg",
    isAvailable: true,
    description: "Moderne, dynamique et économique."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB pour le seeding...');

    // Nettoyage existant
    await User.deleteMany();
    await Car.deleteMany();
    console.log('Anciennes données supprimées.');

    // Création Admin
    const admin = new User({
      email: 'admin@gamilrent.com',
      password: 'admin123' // Sera haché par le middleware du modèle
    });
    await admin.save();
    console.log('Utilisateur Admin créé (admin@gamilrent.com / admin123)');

    // Création Voitures
    await Car.insertMany(cars);
    console.log(`${cars.length} voitures insérées.`);

    console.log('Base de données initialisée avec succès !');
    process.exit();
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
