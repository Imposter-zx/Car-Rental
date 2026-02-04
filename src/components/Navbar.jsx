import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, Phone } from 'lucide-react';

import TrustBar from './TrustBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos Voitures', path: '/#cars' },
    { name: 'À Propos', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-morphism py-2' : 'bg-transparent py-4'}`}>
      {!scrolled && <TrustBar />}
      <div className="container mx-auto px-6 flex justify-between items-center mt-2">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Gamil Rent Car Logo" 
            className="h-12 w-auto object-contain group-hover:scale-110 transition-transform"
          />
          <span className="text-2xl font-bold tracking-tighter text-white">GAMIL <span className="text-primary">RENT CAR</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider"
            >
              {link.name}
            </a>
          ))}
          <a href="https://wa.me/212600000000" className="btn-primary py-2 px-6 text-sm">
            <Phone className="w-4 h-4" />
            Nous Appeler
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-luxury-gray border-b border-white/10 animate-fade-in">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a href="https://wa.me/212600000000" className="btn-primary w-full">
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
