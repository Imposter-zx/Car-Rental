import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Image as ImageIcon, Save, X, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { carService, bookingService, authService } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'bookings'
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const carRes = await carService.getAll();
      const bookingRes = await bookingService.getAll();
      setCars(carRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Supprimer cette voiture ?')) {
      try {
        await carService.delete(id);
        fetchData();
      } catch (err) {
        alert('Erreur');
      }
    }
  };

  return (
    <div className="bg-luxury-black pt-32 pb-16 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Tableau de bord <span className="text-primary italic">Admin</span></h1>
            <div className="flex gap-4 mt-4">
               <button 
                onClick={() => setActiveTab('cars')}
                className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'cars' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-white'}`}
               >
                 Gestion Flotte
               </button>
               <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'bookings' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-white'}`}
               >
                 Réservations
               </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              Nouveau Véhicule
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-white/5"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'cars' ? (
          <div className="bg-luxury-gray rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-luxury-light/50">
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Véhicule</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Détails</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Statut</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-lg border border-white/5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-tighter">{car.name}</p>
                          <p className="text-[10px] text-primary font-bold uppercase">{car.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium whitespace-nowrap">
                        <span>{car.transmission}</span>
                        <span>•</span>
                        <span>{car.fuel}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      {car.available ? (
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-black uppercase tracking-widest">Disponible</span>
                      ) : (
                        <span className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 font-black uppercase tracking-widest">Louée</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"><Edit3 className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleDeleteCar(car._id)}
                          className="w-10 h-10 rounded-lg bg-red-500/5 flex items-center justify-center text-red-500/50 hover:text-red-500 transition-colors border border-red-500/10"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-luxury-gray rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-luxury-light/50">
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Client</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Voiture</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Dates</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest">Statut</th>
                  <th className="p-6 text-[10px] uppercase font-black text-gray-500 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-white tracking-widest uppercase text-xs">{booking.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{booking.phone}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-white text-xs uppercase">{booking.carId?.name || 'Inconnue'}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-[10px] text-gray-400 font-medium">Du {new Date(booking.startDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Au {new Date(booking.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${
                        booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateBooking(booking._id, 'Confirmed')}
                              className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                            ><CheckCircle className="w-4 h-4" /></button>
                            <button 
                              onClick={() => handleUpdateBooking(booking._id, 'Cancelled')}
                              className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            ><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
