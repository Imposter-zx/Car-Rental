import express from 'express';
import Config from '../models/Config.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all config (Public)
router.get('/', async (req, res) => {
  try {
    const config = await Config.find();
    const configMap = config.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(configMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET specific config
router.get('/:key', async (req, res) => {
  try {
    const config = await Config.findOne({ key: req.params.key });
    if (!config) return res.status(404).json({ message: 'Config non trouvée' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE/CREATE config (Admin only)
router.post('/', auth, async (req, res) => {
  const { key, value } = req.body;
  try {
    let config = await Config.findOne({ key });
    if (config) {
      config.value = value;
    } else {
      config = new Config({ key, value });
    }
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
