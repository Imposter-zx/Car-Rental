import React, { useState, useEffect } from 'react';
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
import api from '../../services/api';
import CarFormModal from '../../components/admin/CarFormModal';
import { useAuth } from '../../context/AuthContext';

import { cars as initialCars } from '../../data/cars';

// Transform local data to match dashboard format if necessary
const mockCars = initialCars.map(car => ({
  ...car,
  isAvailable: car.available !== undefined ? car.available : true,
  image: car.image.startsWith('/') ? car.image : car.image // Handle both local and external
}));

const FleetManagement = () => {
  const { user } = useAuth();
  const isDemo = user?.isDemo;
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchCars();
    }
  }, [user]);

  const fetchCars = async () => {
    if (isDemo) {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setCars(mockCars);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/cars');
      setCars(Array.isArray(response.data) ? response.data : mockCars);
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        console.error('Error fetching cars:', error);
      }
      setCars(mockCars);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      if (isDemo) {
        setCars(prev => prev.filter(car => car.id !== id));
        return;
      }
      try {
        await api.delete(`/cars/${id}`);
        setCars(prev => prev.filter(car => car.id !== id));
      } catch (error) {
        console.error('Error deleting car:', error);
        setCars(prev => prev.filter(car => car.id !== id));
      }
    }
  };

  const handleSubmitModal = async (formData) => {
    if (isDemo) {
      if (selectedCar) {
        setCars(prev => prev.map(car => car.id === selectedCar.id ? { ...car, ...formData } : car));
      } else {
        const newCar = { ...formData, id: Date.now().toString() };
        setCars(prev => [newCar, ...prev]);
      }
      setIsModalOpen(false);
      return;
    }

    try {
      if (selectedCar) {
        await api.put(`/cars/${selectedCar.id}`, formData);
        setCars(prev => prev.map(car => car.id === selectedCar.id ? { ...car, ...formData } : car));
      } else {
        const response = await api.post('/cars', formData);
        const newCar = response.data || { ...formData, id: Date.now().toString() };
        setCars(prev => [newCar, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving car:', error);
      if (selectedCar) {
        setCars(prev => prev.map(car => car.id === selectedCar.id ? { ...car, ...formData } : car));
      } else {
        setCars(prev => [{ ...formData, id: Date.now().toString() }, ...prev]);
      }
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
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black">Gestion de Flotte</h1>
          <p className="text-gray-500 mt-1">Gérez vos véhicules, tarifs et disponibilités</p>
        </div>
        <button 
          onClick={handleAddCar}
          className="btn-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30"
        >
          <Plus size={20} />
          Ajouter un véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Véhicules', value: cars.length, icon: <CarIcon />, color: 'primary' },
          { label: 'Disponibles', value: cars.filter(c => c.isAvailable).length, icon: <CheckCircle2 />, color: 'green' },
          { label: 'En Location', value: cars.filter(c => !c.isAvailable).length, icon: <TrendingUp />, color: 'orange' },
          { label: 'Revenu Est. (Jour)', value: `${cars.reduce((acc, c) => acc + (c.isAvailable ? c.price : 0), 0)} MAD`, icon: <DollarSign />, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-luxury-gray p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color === 'primary' ? 'rose' : stat.color}-500/10 text-${stat.color === 'primary' ? 'rose' : stat.color}-500`}>
                {stat.icon}
              </div>
              <ChevronRight className="text-gray-300" size={18} />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold dark:text-white text-luxury-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-luxury-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou catégorie..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">
              <Filter size={18} />
              Filtres
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Véhicule</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Détails</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tarif / Jour</th>
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
                      <p className="text-gray-500">Chargement de la flotte...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <motion.tr 
                    key={car.id} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group hover:bg-gray-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0">
                          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-luxury-black dark:text-white capitalize">{car.name}</p>
                          <p className="text-xs text-gray-500">{car.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                          {car.transmission}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                          {car.fuel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary">{car.price} MAD</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        car.isAvailable 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {car.isAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {car.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditCar(car)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCar(car.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
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

      <CarFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmitModal}
        car={selectedCar}
      />
    </div>
  );
};

export default FleetManagement;
