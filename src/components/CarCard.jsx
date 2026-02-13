import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Users, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';

const CarCard = ({ car }) => {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-luxury-gray rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden shrink-0">
        <img 
          src={car.image} 
          alt={car.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {car.badge && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              {car.badge}
            </span>
          )}
          {car.available ? (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              Disponible aujourd'hui
            </span>
          ) : (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              Indisponible
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">{car.category}</span>
            <h3 className="text-xl font-bold text-white mt-1 uppercase">{car.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-500 uppercase">{car.fuel}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-500 uppercase">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-500 uppercase">{car.seats} Places</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white tracking-tighter">{car.priceDay || car.price} DH</span>
            <span className="text-xs text-gray-400">/ jour</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to={`/car/${car._id || car.id}`}
              className="py-3 rounded-xl border border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white"
            >
              Voir détails
            </Link>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="py-3 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
      <BookingModal car={car} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </motion.div>
  );
};

export default CarCard;
