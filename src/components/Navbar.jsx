import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, Phone, Sun, Moon, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TrustBar from './TrustBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [whatsappNumber, setWhatsappNumber] = useState('212600000000');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/config');
        if (response.data && response.data.whatsapp_number) {
          setWhatsappNumber(response.data.whatsapp_number);
        }
      } catch (error) {
        console.error('Error fetching navbar config:', error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos Voitures', path: '/#cars' },
    { name: 'À Propos', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path || location.hash === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-morphism dark:bg-luxury-gray/80 bg-white/80 py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      {!scrolled && <TrustBar />}
      <div className="container mx-auto px-6 flex justify-between items-center mt-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Car className="text-white w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tighter transition-colors ${scrolled || theme === 'light' ? 'text-luxury-black dark:text-white' : 'text-white'}`}>
            GAMIL <span className="text-primary">RENT CAR</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider ${scrolled || theme === 'light' ? 'text-luxury-black dark:text-white' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${scrolled || theme === 'light' ? 'bg-gray-100 dark:bg-white/5 text-luxury-black dark:text-white' : 'bg-white/5 text-white'} hover:bg-primary hover:text-white`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 text-sm font-bold bg-primary px-4 py-2 rounded-xl text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/20`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-xl transition-all ${scrolled || theme === 'light' ? 'bg-gray-100 dark:bg-white/5 text-luxury-black dark:text-white' : 'bg-white/5 text-white'} hover:bg-red-500 hover:text-white`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`p-2 rounded-xl transition-all ${scrolled || theme === 'light' ? 'bg-gray-100 dark:bg-white/5 text-luxury-black dark:text-white' : 'bg-white/5 text-white'} hover:bg-primary hover:text-white`}
                title="Admin Login"
              >
                <User size={20} />
              </Link>
            )}

        <a href={`https://wa.me/${whatsappNumber}`} className="btn-primary w-full justify-center py-4">
          <Phone className="w-5 h-5" />
          Réserver sur WhatsApp
        </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${scrolled || theme === 'light' ? 'text-luxury-black dark:text-white' : 'text-white'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={`${scrolled || theme === 'light' ? 'text-luxury-black dark:text-white' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-luxury-gray border-b border-gray-100 dark:border-white/10 animate-fade-in shadow-xl">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-lg font-medium text-luxury-black dark:text-white hover:text-primary transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
            
            {user ? (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center gap-3 text-lg font-medium text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  Tableau de bord
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-lg font-medium text-red-500"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-3 text-lg font-medium text-luxury-black dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                Connexion Admin
              </Link>
            )}

            <a href="https://wa.me/212600000000" className="btn-primary w-full justify-center py-4">
              <Phone className="w-5 h-5" />
              Réserver sur WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

