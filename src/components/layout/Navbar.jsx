import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path 
    ? "text-[#1E2F4D] font-bold" 
    : "text-[#1E2F4D] font-medium hover:text-[#243B63]";

  return (
    <nav className="bg-[#FFFFFF] px-6 md:px-16 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2.5">
        <Icon icon="lucide:atom" className="w-8 h-8 text-[#1E2F4D]" />
        <span className="text-2xl font-bold text-[#1E2F4D]">CitizenCare</span>
      </Link>

      <div className="flex items-center gap-10">
        <Link to="/" className={isActive('/')}>Beranda</Link>
        <Link to="/daftar-laporan" className={isActive('/daftar-laporan')}>Lihat Laporan</Link>
        <a href="#tentang-kami" className="text-[#1E2F4D] font-medium hover:text-[#243B63] transition-colors">Tentang Kami</a>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 bg-[#1E2F4D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#243B63] transition-colors"
        >
          <Icon icon="lucide:shield" className="w-4 h-4" />
          Admin
        </Link>
      </div>
    </nav>
  );
}
