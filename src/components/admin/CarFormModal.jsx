import React, { useState, useEffect } from 'react';
import { X, Save, Car, Camera, DollarSign, Info, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CarFormModal = ({ isOpen, onClose, onSubmit, car = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    transmission: 'Manuel',
    fuel: 'Diesel',
    seats: 5,
    price: '',
    image: '',
    description: '',
    isAvailable: true
  });

  useEffect(() => {
    if (car) {
      setFormData(car);
    } else {
      setFormData({
        name: '',
        category: '',
        transmission: 'Manuel',
        fuel: 'Diesel',
        seats: 5,
        price: '',
        image: '',
        description: '',
        isAvailable: true
      });
    }
  }, [car, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-luxury-gray w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/2">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Car className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold dark:text-white text-luxury-black">
                {car ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Info size={16} /> informations générales
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nom du modèle</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                    placeholder="ex: Dacia Duster"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Catégorie</label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                      placeholder="SUV, Compact..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Prix par jour (MAD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        name="price"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                        placeholder="400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Transmission</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white appearance-none"
                    >
                      <option value="Manuel">Manuel</option>
                      <option value="Automatique">Automatique</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Carburant</label>
                    <select
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white appearance-none"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Essence">Essence</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Electrique">Electrique</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Sièges</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Status */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Camera size={16} /> Médias & Statut
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">URL de l'image (Cloudinary/Unsplash)</label>
                  <input
                    type="url"
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.image && (
                    <div className="mt-4 aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Invalid+URL'; }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold dark:text-white">Disponibilité</span>
                    <span className="text-xs text-gray-500">Le véhicule est prêt à être loué</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    className={`transition-colors ${formData.isAvailable ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {formData.isAvailable ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                  </button>
                </div>
              </div>

              {/* Full Width Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Description détaillée</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white resize-none"
                  placeholder="Décrivez les caractéristiques du véhicule..."
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30"
              >
                <Save size={20} />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CarFormModal;
