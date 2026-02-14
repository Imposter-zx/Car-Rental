import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  transmission: { type: String, enum: ['Automatique', 'Manuel'], required: true },
  fuel: { type: String, enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  description: { type: String },
  features: [String]
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
export default Car;
