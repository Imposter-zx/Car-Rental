import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchBookings();

    // Subscribe to Realtime changes
    const channel = supabase
      .channel('bookings-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchBookings(); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchBookings]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      // UI will refetch via Realtime, but for immediate feedback:
      setBookings(prev => prev.map(b => (b.id || b._id) === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const confirmDeleteBooking = (id) => {
    setBookingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingToDelete);

      if (error) throw error;
      console.log('Booking deleted successfully');
      // Realtime listener will handle the local state update
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setBookingToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black font-luxury tracking-tight uppercase">Réservations</h1>
          <p className="text-gray-500 mt-1">Suivez et gérez les demandes de vos clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Demandes', value: bookings.length, icon: <Clock />, color: 'rose' },
          { label: 'Confirmées', value: bookings.filter(b => b.status === 'Confirmé').length, icon: <CheckCircle2 />, color: 'green' },
          { label: 'En Attente', value: bookings.filter(b => b.status === 'En attente').length, icon: <Clock />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-primary/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black dark:text-white text-luxury-black mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Client & Voiture</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Dates & Lieu</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Prix Total</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Statut</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Chargement des réservations...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <motion.tr
                    key={booking.id || booking._id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="font-black text-luxury-black dark:text-white uppercase tracking-tight">{booking.userName}</p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{booking.carName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold">
                          <Calendar size={14} className="text-primary" />
                          <span>Du {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin size={14} />
                          <span className="font-medium tracking-tight">{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-black">
                          <Phone size={14} />
                          <span>{booking.userPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-rose-500 text-lg tracking-tighter">{booking.totalPrice || 'N/A'} MAD</p>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id || booking._id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none outline-none cursor-pointer transition-all shadow-sm ${booking.status === 'Confirmé' ? 'bg-green-500/10 text-green-500' :
                          booking.status === 'Annulé' ? 'bg-red-500/10 text-red-500' :
                            'bg-orange-500/10 text-orange-500 font-primary'
                          }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => confirmDeleteBooking(booking.id || booking._id)}
                          className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm active:scale-90"
                        >
                          <Trash2 size={20} />
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBooking}
        title="Supprimer la réservation ?"
        message="Cette action est irréversible. Toutes les données liées à cette réservation seront définitivement supprimées."
      />
    </div>
  );
};

export default Bookings;
