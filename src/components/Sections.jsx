import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Banknote, MapPin, Star, MessageSquare } from 'lucide-react';

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
          <h2 className="text-3xl md:text-5xl mb-4">Pourquoi Nous Choisir ?</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-luxury-gray rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl mb-4">{f.title}</h3>
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
  const stats = [
    { label: "Clients satisfaits", value: 50, prefix: "+" },
    { label: "Voitures disponibles", value: 8, prefix: "+" },
    { label: "Service rapide", value: 10, suffix: " min" },
  ];

  useEffect(() => {
    const intervals = stats.map((s, i) => {
      return setInterval(() => {
        setCounts(prev => {
          const next = [...prev];
          if (next[i] < s.value) next[i] += 1;
          return next;
        });
      }, 30);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="py-20 bg-luxury-black border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((s, i) => (
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
        <h2 className="text-3xl md:text-4xl mb-6">Besoin d'une voiture rapidement ?</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">Contactez-nous directement sur WhatsApp pour une réservation instantanée sans paperasse inutile.</p>
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
          <h2 className="text-3xl md:text-5xl mb-4">Avis Clients</h2>
          <p className="text-gray-500 italic">+50 clients satisfaits chaque mois</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-luxury-light rounded-3xl border border-white/5 relative">
              <div className="flex gap-1 mb-4">
                {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-gray-300 italic mb-6">"{r.review}"</p>
              <h4 className="font-bold text-white text-lg">— {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ConversionCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
          Besoin d'une voiture maintenant ? <br />
          <span className="italic">Réservez en moins de 2 minutes.</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#cars" className="btn-primary w-full sm:w-auto">Voir les voitures</a>
          <a href="https://wa.me/212600000000" className="btn-secondary w-full sm:w-auto">Contacter sur WhatsApp</a>
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
              GAMIL <span className="text-primary">RENT CAR</span>
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              Votre partenaire de confiance pour la location de voitures à Casablanca. Premium, rapide et transparent.
            </p>
            <div className="flex items-center gap-4">
              <MapPin className="text-primary w-5 h-5" />
              <span className="text-sm text-gray-400">Casablanca, Maroc (Centre-Ville & Aéroport)</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Liens Rapides</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="#cars" className="hover:text-primary transition-colors">Nos Voitures</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">À Propos</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li>Tél: +212 6 00 00 00 00</li>
              <li>WhatsApp: +212 6 00 00 00 00</li>
              <li>Email: contact@gamilrentcar.ma</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Gamil Rent Car Casablanca. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
