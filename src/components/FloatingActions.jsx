import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const FloatingActions = () => {
  return (
    <div className="md:hidden fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      <a 
        href="tel:+212600000000" 
        className="w-14 h-14 bg-white/10 glass-morphism rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 active:scale-90 transition-transform"
      >
        <Phone className="w-6 h-6" />
      </a>
      <a 
        href="https://wa.me/212600000000" 
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] active:scale-90 transition-transform"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
      </a>
    </div>
  );
};

export default FloatingActions;
