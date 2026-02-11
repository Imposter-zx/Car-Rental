import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Gestion de Flotte', icon: <Car size={20} />, path: '/admin/cars' },
    { name: 'Réservations', icon: <Bell size={20} />, path: '/admin/bookings' },
    { name: 'Clients', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Paramètres', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-black transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-luxury-gray border-r border-gray-200 dark:border-white/5 transition-all duration-300 flex flex-col z-40 fixed md:relative h-screen`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg shrink-0">
            <Car className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold dark:text-white text-luxury-black truncate">ADMIN PANEL</span>
          )}
        </div>

        <nav className="flex-grow px-4 mt-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                  active 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'
                }`}
              >
                <div className={`${active ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 p-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navigation */}
        <header className="h-20 bg-white dark:bg-luxury-gray border-b border-gray-200 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/5 rounded-xl px-4 py-2 gap-3 border border-transparent focus-within:border-primary/50 transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none focus:outline-none text-sm dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-luxury-gray"></span>
              </button>
              
              <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold dark:text-white text-luxury-black leading-none">Admin Gamil</p>
                  <p className="text-xs text-gray-500 mt-1">Super Utilisateur</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                  AG
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
