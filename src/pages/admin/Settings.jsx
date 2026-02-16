import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Globe, 
  Bell, 
  Shield, 
  Save,
  Moon,
  Sun,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Settings = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Security Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Config State
  const [configData, setConfigData] = useState({
    whatsapp_number: '',
    maintenance_mode: false
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <User size={18} /> },
    { id: 'security', name: 'Sécurité', icon: <Shield size={18} /> },
    { id: 'system', name: 'Système', icon: <Globe size={18} /> },
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/config');
        if (response.data) {
          setConfigData({
            whatsapp_number: response.data.whatsapp_number || '212600000000',
            maintenance_mode: response.data.maintenance_mode === 'true' || response.data.maintenance_mode === true
          });
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigUpdate = async (key, value) => {
    try {
      await api.post('/config', { key, value });
      setConfigData(prev => ({ ...prev, [key]: value }));
      setMessage({ type: 'success', text: 'Paramètre système mis à jour !' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur système.' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
    }
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour !' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-luxury-black uppercase tracking-tighter">Paramètres</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Configurez votre environnement de gestion</p>
        </div>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
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

        <div className="flex-grow bg-white dark:bg-luxury-gray rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm p-8">
          {activeTab === 'profile' && (
            <motion.form onSubmit={handleProfileUpdate} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-black italic">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="text-lg font-black dark:text-white text-luxury-black uppercase tracking-tighter">{user?.name}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{user?.role || 'Administrateur'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white font-bold" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  disabled={isSaving}
                  type="submit"
                  className="btn-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/30"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Enregistrer les modifications
                </button>
              </div>
            </motion.form>
          )}

          {activeTab === 'security' && (
            <motion.form onSubmit={handlePasswordUpdate} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-black dark:text-white text-luxury-black mb-4 uppercase tracking-tighter">Sécurité du Compte</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirmer le nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  disabled={isSaving}
                  type="submit"
                  className="btn-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/30"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                  Mettre à jour la sécurité
                </button>
              </div>
            </motion.form>
          )}

          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <h3 className="text-lg font-black dark:text-white text-luxury-black mb-4 uppercase tracking-tighter">Configurations Système</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-[24px]">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                           <Phone size={20} />
                        </div>
                        <p className="font-bold dark:text-white uppercase tracking-tighter">WhatsApp de Contact</p>
                     </div>
                     <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest leading-relaxed">Numéro utilisé pour les réservations (format international, ex: 2126...)</p>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={configData.whatsapp_number}
                           onChange={e => setConfigData({...configData, whatsapp_number: e.target.value})}
                           className="flex-grow bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white font-bold text-sm"
                        />
                        <button 
                           onClick={() => handleConfigUpdate('whatsapp_number', configData.whatsapp_number)}
                           className="bg-primary text-white p-2 rounded-xl hover:scale-105 transition-transform"
                        >
                           <Save size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-[24px]">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                              <Shield size={20} />
                           </div>
                           <p className="font-bold dark:text-white uppercase tracking-tighter">Maintenance</p>
                        </div>
                        <button 
                           onClick={() => handleConfigUpdate('maintenance_mode', !configData.maintenance_mode)}
                           className={`w-12 h-6 rounded-full relative transition-colors ${configData.maintenance_mode ? 'bg-red-500' : 'bg-gray-300 dark:bg-white/10'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${configData.maintenance_mode ? 'left-7' : 'left-1'}`}></div>
                        </button>
                     </div>
                     <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest leading-relaxed">Activez ce mode pour suspendre les nouvelles réservations.</p>
                     <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest italic ${configData.maintenance_mode ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {configData.maintenance_mode ? 'Mode Maintenance Actif' : 'Site En Ligne'}
                     </span>
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
