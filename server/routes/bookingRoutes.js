import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all bookings (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new booking (Public)
router.post('/', async (req, res) => {
  const booking = new Booking({
    carId: req.body.carId,
    carName: req.body.carName,
    userName: req.body.userName,
    userPhone: req.body.userPhone,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    location: req.body.location,
    totalPrice: req.body.totalPrice
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE booking status (Admin)
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Réservation non trouvée' });
    
    if (req.body.status) booking.status = req.body.status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE booking (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Réservation non trouvée' });
    
    await booking.deleteOne();
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
