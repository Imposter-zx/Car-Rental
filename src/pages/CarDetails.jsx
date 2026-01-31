import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Fuel, Users, Gauge, Zap, CheckCircle2, 
  MessageSquare, ChevronLeft, Shield, Snowflake, MapPin 
} from 'lucide-react';
import { carService } from '../api/api';
import BookingModal from '../components/BookingModal';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCar = async () => {
      try {
        const { data } = await carService.getAll();
        const found = data.find(c => c._id === id);
        setCar(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <div className="h-screen bg-luxury-black" />;
  if (!car) return <div className="h-screen flex items-center justify-center text-white bg-luxury-black uppercase font-black tracking-tighter">Voiture non trouvée</div>;

  const specs = [
    { icon: <Zap className="w-5 h-5 text-primary" />, label: "Moteur", value: car.engine },
    { icon: <Gauge className="w-5 h-5 text-primary" />, label: "Transmission", value: car.transmission },
    { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Carburant", value: car.fuel },
    { icon: <Users className="w-5 h-5 text-primary" />, label: "Places", value: car.seats },
    { icon: <Snowflake className="w-5 h-5 text-primary" />, label: "Climatisation", value: "Oui (A/C)" },
    { icon: <Shield className="w-5 h-5 text-primary" />, label: "Assurance", value: "Incluse" },
  ];

  return (
    <div className="bg-luxury-black pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ChevronLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Slider/Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl overflow-hidden aspect-[16/10] border border-white/5">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-4">
               {[1, 2, 3].map((_, i) => (
                 <div key={i} className="rounded-xl overflow-hidden h-24 border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-primary font-bold uppercase tracking-widest text-xs">{car.category}</span>
                {car.available ? (
                  <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter shadow-sm border border-green-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Disponible aujourd'hui
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter shadow-sm border border-red-500/30">
                    Réservée
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mt-2 uppercase text-white leading-none tracking-tighter">
                {car.name}
              </h1>
              <div className="flex items-center gap-4 mt-6 text-gray-500 text-sm font-medium">
                <span className="flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-primary" /> Livraison possible à Casablanca
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                   <Fuel className="w-4 h-4 text-primary" /> Consommation économique
                </span>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              {car.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
              {specs.map((spec, i) => (
                <div key={i} className="flex flex-col gap-2 p-5 bg-luxury-gray rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="bg-luxury-light w-10 h-10 rounded-xl flex items-center justify-center">
                    {spec.icon}
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">{spec.label}</span>
                    <span className="block text-white font-bold text-sm tracking-tight">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 space-y-4">
               <div className="p-8 bg-luxury-gray border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-all"></div>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-black tracking-widest mb-1">Prix par jour</p>
                        <p className="text-4xl font-black text-white">{car.price} DH</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-black text-xl">{car.price * 7} DH</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Total / Semaine</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Frais de service</span>
                        <span className="text-white font-bold">Inclus</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Assurance tous risques</span>
                        <span className="text-white font-bold">Inclus</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsBookingOpen(true)}
                      className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/20"
                    >
                      <MessageSquare className="w-6 h-6 fill-white" />
                      Réserver via WhatsApp
                    </button>
                  </div>
               </div>
               
               <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-500 justify-center uppercase font-black tracking-widest">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Kilométrage illimité</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Caution 0 DH</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
      <BookingModal car={car} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default CarDetails;
