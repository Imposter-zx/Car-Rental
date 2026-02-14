import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    recentBookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [carsRes, bookingsRes] = await Promise.all([
        api.get('/cars'),
        api.get('/bookings')
      ]);

      const cars = Array.isArray(carsRes.data) ? carsRes.data : [];
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

      setStats({
        totalCars: cars.length,
        availableCars: cars.filter(c => c.isAvailable).length,
        totalBookings: bookings.length,
        recentBookings: bookings.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Flotte Totale', value: stats.totalCars, icon: <Car />, color: 'rose', trend: '+12%', isUp: true },
    { label: 'Réservations', value: stats.totalBookings, icon: <Calendar />, color: 'blue', trend: '+5%', isUp: true },
    { label: 'Disponibilité', value: `${Math.round((stats.availableCars / (stats.totalCars || 1)) * 100)}%`, icon: <CheckCircle2 />, color: 'green', trend: '-2%', isUp: false },
    { label: 'Revenu Est.', value: '12K DH', icon: <TrendingUp />, color: 'orange', trend: '+18%', isUp: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-luxury-black uppercase tracking-tighter">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1 text-sm tracking-widest uppercase">Aperçu de votre activité aujourd'hui</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-luxury-gray p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -z-10 group-hover:bg-${stat.color}-500/10 transition-all`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-rose-500'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-3xl font-black dark:text-white text-luxury-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-luxury-gray rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Activités Récentes</h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Voir Tout</button>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {isLoading ? (
                 <div className="flex justify-center py-10"><Clock className="animate-spin text-primary" /></div>
              ) : stats.recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-10 uppercase text-xs font-bold">Aucune activité récente</p>
              ) : (
                stats.recentBookings.map((booking, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-primary italic">
                        {booking.carName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white text-sm">{booking.userName}</p>
                        <p className="text-xs text-gray-500 italic">Réserve {booking.carName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold dark:text-white">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      <span className={`text-[10px] uppercase font-black tracking-widest ${
                        booking.status === 'Confirmé' ? 'text-green-500' : 'text-orange-500'
                      }`}>{booking.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips / Promo */}
        <div className="bg-primary p-8 rounded-[32px] shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all"></div>
          <h3 className="text-2xl font-black mb-4 leading-tight uppercase tracking-tighter italic">Astuce de <br />Gestion 🚀</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-8">
            Pensez à mettre à jour les disponibilités après chaque confirmation pour garantir une expérience client premium et sans erreur.
          </p>
          <div className="mt-auto pt-8 border-t border-white/20">
             <div className="flex justify-between items-center">
               <span className="text-xs font-bold uppercase tracking-widest">Niveau Performance</span>
               <span className="text-xl font-black">XCELLENT</span>
             </div>
             <div className="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="w-4/5 h-full bg-white rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
