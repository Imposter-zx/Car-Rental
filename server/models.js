// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model('User', userSchema);

// server/models/Car.js
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['SUV', 'Citadine', 'Luxe'], required: true },
  transmission: { type: String, enum: ['Manuelle', 'Automatique'], required: true },
  fuel: { type: String, enum: ['Diesel', 'Essence'], required: true },
  seats: { type: Number, required: true },
  priceDay: { type: Number, required: true },
  priceWeek: { type: Number, required: true },
  image: { type: String, required: true },
  available: { type: Boolean, default: true },
  description: { type: String },
  engine: { type: String },
  badge: { type: String }
}, { timestamps: true });

export const Car = mongoose.model('Car', carSchema);

// server/models/Booking.js
const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
