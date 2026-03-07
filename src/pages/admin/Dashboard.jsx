import React, { useState, useEffect, useCallback } from 'react';
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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    estimatedRevenue: 0,
    recentBookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [carsRes, bookingsRes] = await Promise.all([
        supabase.from('cars').select('*'),
        supabase.from('bookings').select('*').order('created_at', { ascending: false })
      ]);

      if (carsRes.error) throw carsRes.error;
      if (bookingsRes.error) throw bookingsRes.error;

      const cars = carsRes.data || [];
      const bookings = bookingsRes.data || [];

      // Calculate estimated revenue (sum of all bookings)
      const revenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

      setStats({
        totalCars: cars.length,
        availableCars: cars.filter(c => c.isAvailable).length,
        totalBookings: bookings.length,
        estimatedRevenue: revenue,
        recentBookings: bookings.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchDashboardData();

    // Subscribe to Realtime changes for both cars and bookings
    const carsChannel = supabase
      .channel('dashboard-cars')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, () => fetchDashboardData())
      .subscribe();

    const bookingsChannel = supabase
      .channel('dashboard-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(carsChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, [user, fetchDashboardData]);

  const statCards = [
    { label: 'Flotte Totale', value: stats.totalCars, icon: <Car />, color: 'rose', trend: '+12%', isUp: true },
    { label: 'Réservations', value: stats.totalBookings, icon: <Calendar />, color: 'blue', trend: '+5%', isUp: true },
    { label: 'Disponibilité', value: `${Math.round((stats.availableCars / (stats.totalCars || 1)) * 100)}%`, icon: <CheckCircle2 />, color: 'green', trend: '-2%', isUp: false },
    { label: 'Revenu Est.', value: `${stats.estimatedRevenue.toLocaleString()} DH`, icon: <TrendingUp />, color: 'orange', trend: '+18%', isUp: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-luxury-black font-luxury tracking-tight uppercase tracking-tighter">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Aperçu de votre activité en temps réel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -z-10 group-hover:bg-${stat.color}-500/10 transition-all`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-rose-500'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-3xl font-black dark:text-white text-luxury-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Activités Récentes</h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Voir Tout</button>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {isLoading && stats.recentBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Mise à jour...</p>
                </div>
              ) : stats.recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-10 uppercase text-xs font-bold tracking-widest italic">Aucune activité récente</p>
              ) : (
                stats.recentBookings.map((booking, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary italic shadow-sm group-hover:scale-110 transition-transform">
                        {(booking.carName || 'C').charAt(0)}
                      </div>
                      <div>
                        <p className="font-black dark:text-white text-sm uppercase tracking-tight">{booking.userName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Réserve <span className="text-primary">{booking.carName}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black dark:text-white tracking-tighter">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded shadow-sm ${booking.status === 'Confirmé' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>{booking.status}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips / Promo */}
        <div className="bg-primary p-8 rounded-[32px] shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full group-hover:bg-white/20 transition-all"></div>
          <h3 className="text-2xl font-black mb-4 leading-tight uppercase tracking-tighter italic">Astuce de <br />Gestion 🚀</h3>
          <p className="text-white/80 text-sm font-medium leading-relaxed mb-8">
            Pensez à mettre à jour les disponibilités après chaque confirmation pour garantir une expérience client premium et sans erreur.
          </p>
          <div className="mt-auto pt-8 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Niveau Réservation</span>
              <span className="text-2xl font-black tracking-tighter">XCELLENT</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              ></motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
