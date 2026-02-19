import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ setFilters }) => {
  return (
    <div className="glass-morphism rounded-2xl p-6 mb-12 flex flex-col lg:flex-row items-center gap-6">
      <div className="flex-1 w-full relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Rechercher une voiture..." 
          className="w-full bg-luxury-light border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-all"
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        <div className="flex flex-col gap-1 min-w-[150px]">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-1">Catégorie</span>
          <select 
            className="bg-luxury-light border border-white/5 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-primary cursor-pointer transition-all"
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="All">Toutes</option>
            <option value="Citadine">Citadine</option>
            <option value="SUV">SUV</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-1">Transmission</span>
          <select 
            className="bg-luxury-light border border-white/5 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-primary cursor-pointer transition-all"
            onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
          >
            <option value="All">Toutes</option>
            <option value="Manuel">Manuelle</option>
            <option value="Automatique">Automatique</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-1">Prix Max</span>
          <select 
            className="bg-luxury-light border border-white/5 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-primary cursor-pointer transition-all"
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          >
            <option value="1000">Tous les prix</option>
            <option value="350">350 DH</option>
            <option value="500">500 DH</option>
            <option value="800">800 DH</option>
          </select>
        </div>

        <button 
          className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all mt-auto"
          onClick={() => setFilters({ search: '', category: 'All', transmission: 'All', maxPrice: '1000' })}
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
