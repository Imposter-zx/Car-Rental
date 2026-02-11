import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronRight,
  MoreVertical,
  Filter,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockCustomers = [
  { id: 1, name: 'Ahmed El Mansouri', email: 'ahmed.mansouri@email.com', phone: '+212 661-234567', totalBookings: 5, lastBooking: '2024-02-01', status: 'Actif', avatar: 'AM' },
  { id: 2, name: 'Sara Bennani', email: 'sara.bennani@email.com', phone: '+212 662-345678', totalBookings: 2, lastBooking: '2024-01-15', status: 'Inactif', avatar: 'SB' },
  { id: 3, name: 'Youssef Alami', email: 'youssef.alami@email.com', phone: '+212 663-456789', totalBookings: 12, lastBooking: '2024-02-10', status: 'VIP', avatar: 'YA' },
  { id: 4, name: 'Laila Idrissi', email: 'laila.idrissi@email.com', phone: '+212 664-567890', totalBookings: 8, lastBooking: '2024-02-05', status: 'Actif', avatar: 'LI' },
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black">Gestion des Clients</h1>
          <p className="text-gray-500 mt-1">Gérez votre base de données clients et leur historique</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30">
          <UserPlus size={20} />
          Nouveau Client
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-luxury-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">
            <Filter size={18} />
            Filtres
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Réservations</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredCustomers.map((customer) => (
                <motion.tr 
                  key={customer.id} 
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
                        <p className="text-xs text-gray-500">ID: #{customer.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-bold dark:text-white text-luxury-black">{customer.totalBookings}</p>
                      <p className="text-xs text-gray-500">Dernière: {customer.lastBooking}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      customer.status === 'VIP' ? 'bg-amber-500/10 text-amber-500' :
                      customer.status === 'Actif' ? 'bg-green-500/10 text-green-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <ChevronRight size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
