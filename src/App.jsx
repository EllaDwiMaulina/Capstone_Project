import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx'; 
import Footer from './components/layout/Footer.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';
import Beranda from './pages/Beranda.jsx';
import BuatLaporan from './pages/BuatLaporan.jsx';
import DaftarLaporan from './pages/DaftarLaporan.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import DetailLaporan from './pages/admin/DetailLaporan.jsx';
import DaftarLaporanAdmin from './pages/admin/DaftarLaporanAdmin.jsx';
import LoginAdmin from './pages/admin/LoginAdmin.jsx';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar /> 
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Beranda />} />
          <Route path="buat-laporan" element={<BuatLaporan />} />
          <Route path="daftar-laporan" element={<DaftarLaporan />} />
        </Route>

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/laporan" element={<DaftarLaporanAdmin />} />
          <Route path="/admin/laporan/:id" element={<DetailLaporan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
