import React from 'react';
import { ShieldCheck, Clock, Plane } from 'lucide-react';

const TrustBar = () => {
  return (
    <div className="bg-luxury-black border-b border-white/5 py-2 hidden md:block">
      <div className="container mx-auto px-6 flex justify-center gap-12">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Assurance incluse</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Assistance 24/7</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <Plane className="w-3.5 h-3.5 text-primary" />
          <span>Livraison possible à l’aéroport</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
