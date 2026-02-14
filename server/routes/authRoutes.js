import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// UPDATE profile
router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// UPDATE password
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
