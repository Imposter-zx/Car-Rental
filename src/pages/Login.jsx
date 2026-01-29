import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { authService } from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch (err) {
      setError('Identifiants invalides ou erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-luxury-gray p-10 rounded-[40px] border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-2xl mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Accès <span className="text-primary italic">Admin</span></h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Gérez votre plateforme Gamil Rent Car</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              required
              type="email" 
              placeholder="Email admin" 
              className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all text-sm font-medium"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              required
              type="password" 
              placeholder="Mot de passe" 
              className="w-full bg-luxury-light p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary transition-all text-sm font-medium"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="btn-primary w-full py-5 text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-10"
          >
            {loading ? 'Connexion...' : (
              <>
                Se connecter
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
