import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import CarCard from '../components/CarCard';
import { Features, WhatsAppCTA, Testimonials, StatsSection, ConversionCTA } from '../components/Sections';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';
import FloatingActions from '../components/FloatingActions';

import api from '../services/api';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    transmission: 'All',
    maxPrice: '1000'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/cars');
        setCars(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching cars for home page:', error);
        setCars([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on user criteria
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || car.category === filters.category;
      const matchesTransmission = filters.transmission === 'All' || car.transmission === filters.transmission;
      const matchesPrice = car.price <= parseInt(filters.maxPrice);
      return matchesSearch && matchesCategory && matchesTransmission && matchesPrice;
    });
  }, [cars, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="bg-luxury-black min-h-screen">
      <Hero />
      
      <section id="cars" className="py-24 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-primary font-bold uppercase tracking-widest text-sm">Flotte disponible</span>
          <h2 className="text-4xl md:text-5xl mt-2 tracking-tight">Choisissez votre <span className="text-gradient-red italic">compagnon</span> de route</h2>
        </motion.div>

        <FilterBar filters={filters} setFilters={setFilters} />

        {isLoading ? (
          <SkeletonLoader />
        ) : filteredCars.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car) => (
                <motion.div key={car._id || car.id} variants={itemVariants}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-luxury-gray rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-400 text-lg">Aucune voiture ne correspond à vos critères.</p>
            <button 
              onClick={() => setFilters({ search: '', category: 'All', transmission: 'All', maxPrice: '1000' })}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Features />
      </motion.div>
      <StatsSection />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <WhatsAppCTA />
      </motion.div>
      <Testimonials />
      <ConversionCTA />
      <FloatingActions />
    </main>
  );
};

export default Home;
