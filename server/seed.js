import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Car from './models/Car.js';

dotenv.config();

const cars = [
  {
    name: "Dacia Logan",
    category: "Citadine",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    price: 300,
    image: "https://images.carprices.com/pricefiles/0/4904/original/2021-dacia-logan.jpg",
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
    image: "https://www.largus.fr/images/images/dacia-sandero-stepway-2021-15.jpg",
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
    image: "https://www.largus.fr/images/images/dacia-duster-2-phase-2-2021-6.jpg",
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
    image: "https://cdn.motor1.com/images/mgl/1XmE9/s1/renault-clio-hybrid-2020.jpg",
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
    image: "https://cdn.motor1.com/images/mgl/oY7Xw/s1/2020-opel-corsa.jpg",
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
    image: "https://www.largus.fr/images/images/peugeot-208-gt-line-2019-12.jpg",
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
    image: "https://cdn.motor1.com/images/mgl/MkOOn/s1/2021-hyundai-tucson-front-view.jpg",
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
    image: "https://www.volkswagen.co.uk/idhub/dotcom/content/dam/dotcom/en_gb/models/t-roc/t-roc-pa/VWC_80327_T-Roc_R-Line_Kings_Red_1.jpg",
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
    await Car.deleteMany();
    console.log('Anciennes données supprimées.');

    // Création Admin
    const admin = new User({
      email: 'admin@gamil.ma',
      password: 'admin123' // Sera haché par le middleware du modèle
    });
    await admin.save();
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
