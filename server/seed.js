import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Car } from './models.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});

    // Create Admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
    });
    console.log('Admin user created');

    // Create Cars
    const cars = [
      {
        name: "Dacia Logan",
        category: "Citadine",
        transmission: "Manuelle",
        fuel: "Diesel",
        seats: 5,
        priceDay: 300,
        priceWeek: 1800,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
        badge: "Best Price",
        available: true,
        engine: "1.5 dCi"
      },
      {
        name: "Hyundai Tucson",
        category: "SUV",
        transmission: "Automatique",
        fuel: "Diesel",
        seats: 5,
        priceDay: 800,
        priceWeek: 5000,
        image: "https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?auto=format&fit=crop&q=80&w=800",
        available: true,
        engine: "1.6 CRDi"
      }
    ];

    await Car.insertMany(cars);
    console.log('Sample cars inserted');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
