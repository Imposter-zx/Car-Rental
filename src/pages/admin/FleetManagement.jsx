import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  Car as CarIcon,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import CarFormModal from '../../components/admin/CarFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

const FleetManagement = () => {
  const { user } = useAuth();
  const isDemo = user?.isDemo;
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchCars();

    // Subscribe to Realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cars'
        },
        () => {
          fetchCars(); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCars]);

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const confirmDeleteCar = (id) => {
    setCarToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carToDelete);

      if (error) throw error;
      console.log('Car deleted successfully');
      // Realtime listener will handle the local state update/refetch
    } catch (error) {
      console.error('Error deleting car:', error);
      // Fallback: update local state if realtime fails
      setCars(prev => prev.filter(car => (car.id || car._id) !== carToDelete));
    } finally {
      setCarToDelete(null);
    }
  };

  const handleSubmitModal = async (formData) => {
    try {
      const carId = selectedCar?.id || selectedCar?._id;
      if (selectedCar) {
        const { error } = await supabase
          .from('cars')
          .update(formData)
          .eq('id', carId);

        if (error) throw error;
        console.log('Car updated successfully');
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([formData]);

        if (error) throw error;
        console.log('Car added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving car:', error);
      setIsModalOpen(false);
    }
  };

  const filteredCars = Array.isArray(cars) ? cars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black font-luxury tracking-tight">Gestion de Flotte</h1>
          <p className="text-gray-500 mt-1">Gérez vos véhicules, tarifs et disponibilités</p>
        </div>
        <button
          onClick={handleAddCar}
          className="btn-primary px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} />
          Ajouter un véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Véhicules', value: cars.length, icon: <CarIcon />, color: 'rose' },
          { label: 'Disponibles', value: cars.filter(c => c.isAvailable).length, icon: <CheckCircle2 />, color: 'green' },
          { label: 'En Location', value: cars.filter(c => !c.isAvailable).length, icon: <TrendingUp />, color: 'orange' },
          { label: 'Revenu Est. (Jour)', value: `${cars.reduce((acc, c) => acc + (c.isAvailable ? c.price : 0), 0)} MAD`, icon: <DollarSign />, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-primary/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" size={18} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black dark:text-white text-luxury-black mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 dark:bg-luxury-gray/70 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10">
              <Filter size={18} />
              Filtres
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Véhicule</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Détails</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Tarif / Jour</th>
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
                      <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Chargement de la flotte...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <motion.tr
                    key={car.id || car._id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-luxury-black dark:text-white text-lg tracking-tight uppercase">{car.name}</p>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{car.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                          {car.transmission}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                          {car.fuel}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-primary text-lg tracking-tighter">{car.price} MAD</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${car.isAvailable
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500 font-primary'
                        }`}>
                        {car.isAvailable ? <CheckCircle2 size={14} className="animate-pulse" /> : <XCircle size={14} />}
                        {car.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="p-3 text-gray-400 hover:text-white hover:bg-primary rounded-2xl transition-all shadow-sm active:scale-90"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDeleteCar(car.id || car._id)}
                          className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm active:scale-90"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
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

      <CarFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        car={selectedCar}
        key={selectedCar?.id || selectedCar?._id || 'new'}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCar}
        title="Supprimer le véhicule ?"
        message="Cette action est irréversible. Toutes les données liées à ce véhicule seront définitivement supprimées."
      />
    </div>
  );
};

export default FleetManagement;
