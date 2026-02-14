import express from 'express';
import Car from '../models/Car.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cars
// @desc    Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des voitures' });
  }
});

// @route   GET /api/cars/:id
// @desc    Get car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la voiture' });
  }
});

// @route   POST /api/cars
// @desc    Add new car (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const car = await newCar.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l’ajout de la voiture', error: error.message });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update car (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete car (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
    res.json({ message: 'Voiture supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
