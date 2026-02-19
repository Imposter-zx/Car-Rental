import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Trash
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  // useAuth() is used to check if user is logged in via context, but user object not directly needed here
  useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Supprimer cette réservation ?')) {
      try {
        await api.delete(`/bookings/${id}`);
        setBookings(prev => prev.filter(b => b._id !== id));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black uppercase tracking-tighter">Réservations</h1>
          <p className="text-gray-500 mt-1">Suivez et gérez les demandes de vos clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Demandes', value: bookings.length, icon: <Clock />, color: 'primary' },
          { label: 'Confirmées', value: bookings.filter(b => b.status === 'Confirmé').length, icon: <CheckCircle2 />, color: 'green' },
          { label: 'En Attente', value: bookings.filter(b => b.status === 'En attente').length, icon: <Clock />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-luxury-gray p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color === 'primary' ? 'rose' : stat.color}-500/10 text-${stat.color === 'primary' ? 'rose' : stat.color}-500`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold dark:text-white text-luxury-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-luxury-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Client & Voiture</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Dates & Lieu</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Prix Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-500">Chargement des réservations...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <motion.tr 
                    key={booking._id} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-luxury-black dark:text-white">{booking.userName}</p>
                          <p className="text-xs text-gray-500 font-bold text-primary italic uppercase">{booking.carName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar size={12} className="text-primary" />
                          <span>Du {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 italic">
                          <MapPin size={12} />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold">
                           <Phone size={12} />
                           <span>{booking.userPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-rose-500 italic">{booking.totalPrice || 'N/A'} DH</p>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${
                          booking.status === 'Confirmé' ? 'bg-green-500/10 text-green-500' :
                          booking.status === 'Annulé' ? 'bg-red-500/10 text-red-500' :
                          'bg-orange-500/10 text-orange-500'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
