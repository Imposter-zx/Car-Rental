import React, { useState, useEffect } from 'react';
import { X, Save, Car, Camera, DollarSign, Info, ToggleLeft, ToggleRight, Upload, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CarFormModal = ({ isOpen, onClose, onSubmit, car = null }) => {
  const [imageSource, setImageSource] = useState('url');
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
      setImageSource(car.image?.startsWith('data:') ? 'file' : 'url');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Illustration du véhicule</label>
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setImageSource('url')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                          imageSource === 'url' 
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <LinkIcon size={14} /> URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSource('file')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                          imageSource === 'file' 
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Upload size={14} /> Fichier
                      </button>
                    </div>
                  </div>

                  {imageSource === 'url' ? (
                    <input
                      type="url"
                      name="image"
                      required
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="car-image-upload"
                      />
                      <label 
                        htmlFor="car-image-upload"
                        className="flex items-center justify-center gap-3 w-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl py-8 px-4 hover:border-primary/50 cursor-pointer transition-all group"
                      >
                        <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                          <Upload className="text-primary w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold dark:text-white">Choisir une image</p>
                          <p className="text-xs text-gray-500">JPG, PNG ou WebP (max 5MB)</p>
                        </div>
                      </label>
                    </div>
                  )}

                  {formData.image && (
                    <div className="mt-4 aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative group">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Format+invalide'; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">Aperçu en direct</span>
                      </div>
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
