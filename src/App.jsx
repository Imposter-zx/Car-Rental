import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import FleetManagement from './pages/admin/FleetManagement';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import { Footer } from './components/Sections';
import { AuthProvider } from './context/AuthContext';

// Admin Pages (to be implemented)
const Bookings = () => <div className="text-luxury-black dark:text-white p-8">Bookings View (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-luxury-black transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Main Application with Navbar/Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/car/:id" element={<CarDetails />} />
                  </Routes>
                </div>
                <Footer />
              </>
            } />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/cars" replace />} />
                <Route path="cars" element={<FleetManagement />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="customers" element={<Customers />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


