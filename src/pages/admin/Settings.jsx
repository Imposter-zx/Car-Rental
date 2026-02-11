import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Globe, 
  Bell, 
  Shield, 
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <User size={18} /> },
    { id: 'security', name: 'Sécurité', icon: <Shield size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', name: 'Système', icon: <Globe size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-luxury-black">Paramètres du Système</h1>
        <p className="text-gray-500 mt-1">Gérez vos préférences de compte et configurations système</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white dark:bg-luxury-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-8">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                  AG
                </div>
                <div>
                  <h3 className="text-lg font-bold dark:text-white text-luxury-black">Admin Gamil</h3>
                  <p className="text-sm text-gray-500">Super Administrateur</p>
                  <button className="text-primary text-xs font-bold mt-2 hover:underline">Modifier la photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nom Complet</label>
                  <input type="text" defaultValue="Admin Gamil" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                  <input type="email" defaultValue="admin@gamilrent.com" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Bio / Notes</label>
                <textarea rows="3" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white resize-none"></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn-primary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30">
                  <Save size={20} />
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-bold dark:text-white text-luxury-black mb-4">Changer le mot de passe</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Mot de passe actuel</label>
                  <input type="password" underline className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nouveau mot de passe</label>
                  <input type="password" underline className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirmer le mot de passe</label>
                  <input type="password" underline className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn-primary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30">
                  <Shield size={20} />
                  Mettre à jour la sécurité
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <div>
                    <p className="font-bold dark:text-white">Maintenance Mode</p>
                    <p className="text-xs text-gray-500">Mettre le site en mode maintenance</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 dark:bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <div>
                    <p className="font-bold dark:text-white">Devises</p>
                    <p className="text-xs text-gray-500">Sélectionner la devise par défaut</p>
                  </div>
                  <select className="bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white outline-none">
                    <option value="MAD">MAD - Dirham Marocain</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
