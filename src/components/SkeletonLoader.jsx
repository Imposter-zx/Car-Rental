import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-luxury-gray rounded-2xl overflow-hidden border border-white/5 h-[450px] animate-pulse">
          <div className="h-60 bg-luxury-light w-full"></div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-luxury-light w-1/4 rounded"></div>
            <div className="h-6 bg-luxury-light w-3/4 rounded"></div>
            <div className="grid grid-cols-3 gap-4 pt-4">
               <div className="h-8 bg-luxury-light rounded"></div>
               <div className="h-8 bg-luxury-light rounded"></div>
               <div className="h-8 bg-luxury-light rounded"></div>
            </div>
            <div className="flex gap-3 pt-6">
               <div className="h-10 bg-luxury-light flex-1 rounded-xl"></div>
               <div className="h-10 bg-luxury-light flex-1 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
