import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  carName: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['En attente', 'Confirmé', 'Annulé'], default: 'En attente' },
  totalPrice: { type: Number }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
