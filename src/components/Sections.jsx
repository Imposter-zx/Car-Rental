import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Banknote, MapPin, Star, MessageSquare } from 'lucide-react';
import api from '../services/api';

export const Features = () => {
  const features = [
    { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: "Voitures récentes", desc: "Une flotte entretenue et régulièrement renouvelée." },
    { icon: <Zap className="w-8 h-8 text-primary" />, title: "Réponse rapide", desc: "Service client disponible 7j/7 pour vous assister." },
    { icon: <Banknote className="w-8 h-8 text-primary" />, title: "Prix compétitifs", desc: "Le meilleur rapport qualité-prix à Casablanca." },
    { icon: <MapPin className="w-8 h-8 text-primary" />, title: "Basé à Casablanca", desc: "Livraison possible à l'aéroport ou centre-ville." },
  ];

  return (
    <section id="about" className="py-24 bg-luxury-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4 text-white">Pourquoi Nous Choisir ?</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-luxury-gray rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl mb-4 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StatsSection = () => {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [targetStats, setTargetStats] = useState([
    { label: "Clients satisfaits", value: 50, prefix: "+" },
    { label: "Voitures disponibles", value: 8, prefix: "+" },
    { label: "Service rapide", value: 10, suffix: " min" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/bookings')
        ]);
        
        const cars = Array.isArray(carsRes.data) ? carsRes.data : [];
        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        
        // Calculate unique customers based on names/phones
        const uniqueCustomers = new Set(bookings.map(b => b.userName + b.userPhone)).size;
        const availableCars = cars.filter(c => c.isAvailable).length;

        setTargetStats([
          { label: "Clients satisfaits", value: uniqueCustomers > 10 ? uniqueCustomers : 50, prefix: "+" },
          { label: "Voitures disponibles", value: availableCars > 0 ? availableCars : 8, prefix: "+" },
          { label: "Service rapide", value: 10, suffix: " min" },
        ]);
      } catch (error) {
        console.error('Error fetching landing stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const intervals = targetStats.map((s, i) => {
      return setInterval(() => {
        setCounts(prev => {
          const next = [...prev];
          if (next[i] < s.value) next[i] += 1;
          else if (next[i] > s.value) next[i] = s.value;
          return next;
        });
      }, 30);
    });
    return () => intervals.forEach(clearInterval);
  }, [targetStats]);

  return (
    <section className="py-20 bg-luxury-black border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {targetStats.map((s, i) => (
            <div key={i}>
              <h3 className="text-5xl md:text-7xl text-gradient-red mb-2 font-black tabular-nums">
                {s.prefix}{counts[i]}{s.suffix}
              </h3>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-black">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const WhatsAppCTA = () => {
  return (
    <section className="py-20 bg-luxury-gray">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl mb-6 text-white text-gradient-red uppercase font-black tracking-tighter italic">Besoin d'une voiture rapidement ?</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto uppercase tracking-widest text-xs font-bold">Contactez-nous directement sur WhatsApp pour une réservation instantanée sans paperasse inutile.</p>
        <a 
          href="https://wa.me/212600000000" 
          className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] transform hover:-translate-y-1"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
          Réserver via WhatsApp
        </a>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const reviews = [
    { name: "Yassine B.", review: "Excellent service. Voiture propre et conforme. Merci à l'équipe Gamil Rent Car.", stars: 5 },
    { name: "Sarah M.", review: "Réservation facile via WhatsApp. Le Tucson était en parfait état. Je recommande !", stars: 5 },
    { name: "Ahmed K.", review: "Prix très raisonnables pour la qualité du service. Livraison à l'aéroport à l'heure.", stars: 5 },
  ];

  return (
    <section className="py-24 bg-luxury-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4 text-white font-black uppercase tracking-tighter">Avis Clients</h2>
          <p className="text-gray-500 italic uppercase tracking-widest text-xs font-bold font-black">+50 clients satisfaits chaque mois</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-luxury-light rounded-3xl border border-white/5 relative group hover:border-primary/50 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-gray-300 italic mb-6">"{r.review}"</p>
              <h4 className="font-bold text-white text-lg uppercase tracking-tighter">— {r.name}</h4>
              <div className="absolute top-4 right-8 text-primary/10 group-hover:text-primary/20 transition-all">
                 <Star size={40} className="fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ConversionCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-luxury-black border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl mb-8 leading-tight text-white font-black uppercase tracking-tighter italic">
          Besoin d'une voiture maintenant ? <br />
          <span className="text-primary italic">Réservez en moins de 2 minutes.</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#cars" className="btn-primary w-full sm:w-auto px-12 py-5 text-xl">Voir les voitures</a>
          <a href="https://wa.me/212600000000" className="btn-secondary w-full sm:w-auto px-12 py-5 text-xl">Contacter sur WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer id="contact" className="py-16 bg-luxury-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-tighter">
              GAMIL <span className="text-primary italic">RENT CAR</span>
            </h3>
            <p className="text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">
              Votre partenaire de confiance pour la location de voitures à Casablanca. Premium, rapide et transparent.
            </p>
            <div className="flex items-center gap-4 group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin size={20} />
              </div>
              <span className="text-sm text-gray-400 font-medium">Casablanca, Maroc (Centre-Ville & Aéroport)</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] opacity-50">Liens Rapides</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="#cars" className="hover:text-primary transition-colors">Nos Voitures</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">À Propos</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] opacity-50">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm font-bold uppercase tracking-widest">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 italic text-primary">Tél: +212 6 00 00 00 00</li>
              <li className="hover:text-white transition-colors cursor-pointer text-green-500">WhatsApp: +212 6 00 00 00 00</li>
              <li className="hover:text-white transition-colors cursor-pointer lowercase">contact@gamilrentcar.ma</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
          <p>© {new Date().getFullYear()} Gamil Rent Car Casablanca. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
