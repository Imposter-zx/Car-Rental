import React, { useState, useEffect } from 'react';
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
import api from '../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomersFromBookings();
  }, []);

  const fetchCustomersFromBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bookings');
      const bookings = Array.isArray(response.data) ? response.data : [];
      
      // Aggregate unique customers based on Phone Number (unique identifier for our case)
      const customerMap = new Map();
      
      bookings.forEach(booking => {
        const key = booking.userPhone;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: booking._id,
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
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black uppercase tracking-tighter">Gestion des Clients</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Base de données générée depuis vos réservations</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-luxury-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou téléphone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Réservations</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Dernière Demande</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Analyse des réservations...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500 uppercase text-xs font-bold tracking-widest italic">
                    Aucun client enregistré pour le moment
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, i) => (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-luxury-black dark:text-white">{customer.name}</p>
                          <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Actif</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-primary font-bold">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-xl font-black text-luxury-black dark:text-white">{customer.totalBookings}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Clock size={14} />
                        {new Date(customer.lastBooking).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <a href={`tel:${customer.phone}`} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                            <Phone size={16} />
                         </a>
                         <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all">
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
