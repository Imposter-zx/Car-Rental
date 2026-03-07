import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  MoreVertical,
  Filter,
  UserPlus,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomersFromBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*');

      if (error) throw error;

      // Aggregate unique customers based on Phone Number (unique identifier for our case)
      const customerMap = new Map();

      bookings.forEach(booking => {
        const key = booking.userPhone;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: booking.id || booking._id,
            name: booking.userName,
            phone: booking.userPhone,
            email: 'N/A', // Email not collected in current booking form
            totalBookings: 1,
            lastBooking: booking.createdAt,
            status: 'Actif',
            avatar: booking.userName.charAt(0).toUpperCase()
          });
        } else {
          const existing = customerMap.get(key);
          existing.totalBookings += 1;
          if (new Date(booking.createdAt) > new Date(existing.lastBooking)) {
            existing.lastBooking = booking.createdAt;
          }
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Error aggregate customers from bookings:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchCustomersFromBookings();

    // Subscribe to Realtime changes in bookings since customers are derived from them
    const channel = supabase
      .channel('customers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchCustomersFromBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCustomersFromBookings]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black font-luxury tracking-tight uppercase">Gestion Clients</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Base de données générée depuis vos réservations</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Clients', value: customers.length, icon: <Users />, color: 'rose' },
          { label: 'Clients Fidèles', value: customers.filter(c => c.totalBookings > 1).length, icon: <UserPlus />, color: 'green' },
          { label: 'Nouveaux (Mois)', value: customers.filter(c => new Date(c.lastBooking) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: <Clock />, color: 'blue' },
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

      {/* Customers Table */}
      <div className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Client</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Contact</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500 text-center">Réservations</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Dernière Demande</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Analyse des réservations...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center text-gray-500 font-bold uppercase tracking-widest text-sm italic">
                    Aucun client enregistré pour le moment
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-black text-luxury-black dark:text-white uppercase tracking-tight">{customer.name}</p>
                          <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Actif</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-primary font-black">
                        <Phone size={16} />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-2xl font-black text-luxury-black dark:text-white tracking-tighter">{customer.totalBookings}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                        <Clock size={16} className="text-primary" />
                        {new Date(customer.lastBooking).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <a href={`tel:${customer.phone}`} className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90">
                          <Phone size={18} />
                        </a>
                        <button className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all">
                          <MoreVertical size={18} />
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

export default Customers;
