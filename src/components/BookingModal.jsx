import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import api from '../services/api';

const BookingModal = ({ car, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    startDate: '',
    endDate: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    whatsapp_number: '212600000000',
    maintenance_mode: false,
    loaded: false
  });

  useEffect(() => {
    if (isOpen) {
      const fetchConfig = async () => {
        try {
          const res = await api.get('/config');
          if (res.data) {
            setConfig({
              whatsapp_number: res.data.whatsapp_number || '212600000000',
              maintenance_mode: res.data.maintenance_mode === 'true' || res.data.maintenance_mode === true,
              loaded: true
            });
          }
        } catch (e) {
          console.error('Error fetching booking config:', e);
          setConfig(prev => ({ ...prev, loaded: true }));
        }
      };
      fetchConfig();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let totalPrice = car.price;
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        totalPrice = car.price * (days > 0 ? days : 1);
      }

      await api.post('/bookings', {
        carId: car._id || car.id,
        carName: car.name,
        userName: formData.name,
        userPhone: formData.phone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        totalPrice: totalPrice
      });

      const message = `Bonjour, je veux réserver la voiture: ${car.name}%0ANom: ${formData.name}%0ATél: ${formData.phone}%0ADate de début: ${formData.startDate}%0ADate de fin: ${formData.endDate}%0ALieu: ${formData.location}%0APrix Estimé: ${totalPrice} DH`;
      window.open(`https://wa.me/${config.whatsapp_number}?text=${message}`, '_blank');
      
      onClose();
      alert('Votre réservation a été enregistrée et la demande WhatsApp est ouverte !');
    } catch (error) {
      console.error('Error saving booking:', error);
      const message = `Bonjour, je veux réserver la voiture: ${car.name}%0ANom: ${formData.name}%0ATél: ${formData.phone}%0ADate de début: ${formData.startDate}%0ADate de fin: ${formData.endDate}%0ALieu: ${formData.location}`;
      window.open(`https://wa.me/${config.whatsapp_number}?text=${message}`, '_blank');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-luxury-gray w-full max-w-lg rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tighter">Réserver <span className="text-primary italic">{car.name}</span></h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Étape finale vers votre liberté</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!config.loaded ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Vérification du système...</p>
              </div>
            ) : config.maintenance_mode ? (
              <div className="py-12 text-center space-y-6">
                <div className="inline-flex p-6 bg-red-500/10 text-red-500 rounded-full mb-4">
                   <Shield size={48} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tighter">Maintenance en cours</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                   Nous effectuons actuellement une mise à jour de notre système de réservation. Veuillez nous contacter directement par téléphone.
                </p>
                <div className="pt-6">
                   <a 
                     href={`tel:${config.whatsapp_number}`}
                     className="btn-primary w-full py-4 flex items-center justify-center gap-3"
                   >
                      <Phone size={20} />
                      Appeler l'Agence
                   </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><Send className="w-4 h-4" /></span>
                    <input 
                      required 
                      type="text" 
                      placeholder="Votre Nom complet" 
                      className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all font-medium text-sm text-white"
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><Phone className="w-4 h-4" /></span>
                    <input 
                      required 
                      type="tel" 
                      placeholder="Téléphone / WhatsApp" 
                      className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all font-medium text-sm text-white"
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><Calendar className="w-4 h-4" /></span>
                      <input 
                        required 
                        type="date" 
                        className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all font-medium text-sm text-gray-400 hover:text-white"
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><Calendar className="w-4 h-4" /></span>
                      <input 
                        required 
                        type="date" 
                        className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all font-medium text-sm text-gray-400 hover:text-white"
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"><MapPin className="w-4 h-4" /></span>
                    <input 
                      required 
                      type="text" 
                      placeholder="Lieu de livraison (ex: Aéroport Casablanca)" 
                      className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all font-medium text-sm text-white"
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    {loading ? 'Enregistrement...' : (
                      <>
                        Confirmer la réservation
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-600 text-center mt-6 uppercase tracking-widest font-bold">
                    En cliquant, vous acceptez de partager ces infos avec Gamil Rent Car
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
