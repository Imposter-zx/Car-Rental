import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Car from './models/Car.js';
import Config from './models/Config.js';

dotenv.config();

const cars = [
  {
    name: "Dacia Logan",
    category: "Citadine",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    price: 300,
    image: "/dacia-logan.png",
    isAvailable: true,
    engine: "1.5 dCi",
    description: "La Dacia Logan est la berline familiale par excellence, offrant un espace généreux et une économie de carburant imbattable."
  },
  {
    name: "Dacia Sandero Stepway",
    category: "Citadine",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    price: 350,
    image: "/dacia-sandero.png",
    isAvailable: true,
    engine: "1.5 dCi",
    description: "Moderne et robuste, la Sandero Stepway est parfaite pour naviguer dans les rues de Casablanca avec style."
  },
  {
    name: "Dacia Duster",
    category: "SUV",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    price: 450,
    image: "/dacia-duster.png",
    isAvailable: true,
    engine: "1.5 dCi 4x2",
    description: "Un SUV polyvalent capable de vous emmener partout, du centre-ville aux plages environnantes."
  },
  {
    name: "Renault Clio 5",
    category: "Citadine",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    price: 400,
    image: "/renault-clio.png",
    isAvailable: true,
    engine: "1.5 Blue dCi",
    description: "La référence des citadines. Confortable, technologique et très agréable à conduire."
  },
  {
    name: "Opel Corsa",
    category: "Citadine",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    price: 450,
    image: "/opel-corsa.png",
    isAvailable: true,
    engine: "1.2 Turbo",
    description: "Design allemand et boîte automatique pour une conduite fluide et sans effort."
  },
  {
    name: "Peugeot 208",
    category: "Citadine",
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    price: 500,
    image: "/peugeot-208.png",
    isAvailable: true,
    engine: "1.5 BlueHDi",
    description: "L'élégance à la française. Un intérieur i-Cockpit futuriste pour une expérience premium."
  },
  {
    name: "Hyundai Tucson",
    category: "SUV",
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    price: 800,
    image: "/hyundai-tucson.png",
    isAvailable: true,
    engine: "1.6 CRDi",
    description: "Un SUV premium avec tout le confort nécessaire pour vos déplacements professionnels ou familiaux."
  },
  {
    name: "Volkswagen T-Roc",
    category: "SUV",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    price: 750,
    image: "/vw-troc.png",
    isAvailable: true,
    engine: "1.5 TSI",
    description: "Sportif et robuste, le T-Roc combine le meilleur de la technologie Volkswagen avec un design audacieux."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB pour le seeding...');

    // Nettoyage existant
    await User.deleteMany();
    await User.deleteMany({});
    await Car.deleteMany({});
    await Config.deleteMany({});

    // Create admin user
    const admin = new User({
      email: 'admin@gamil.ma',
      password: 'admin123',
      name: 'Admin Gamil',
      role: 'admin'
    });
    await admin.save();

    // Create default config
    const defaultConfig = [
      { key: 'whatsapp_number', value: '212600000000', description: 'Numéro WhatsApp principal' },
      { key: 'maintenance_mode', value: false, description: 'Statut de maintenance du site' }
    ];
    await Config.insertMany(defaultConfig);
    console.log('Utilisateur Admin créé (admin@gamil.ma / admin123)');

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
