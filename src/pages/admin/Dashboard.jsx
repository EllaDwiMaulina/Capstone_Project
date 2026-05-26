import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { clearAdminSession } from '../../utils/adminAuth.js';
import AdminMapModal from '../../components/admin/AdminMapModal.jsx';

// Kamus bahasa untuk fitur dinamis
const t = {
  id: {
    title: "Dashboard Admin",
    subtitle: "Manajemen seluruh laporan masuk sistem.",
    daftar: "Daftar Laporan Terbaru",
    dashboard: "Dashboard",
    laporan: "Daftar Laporan",
    peta: "Peta Laporan",
    pengaturan: "Pengaturan"
  },
  en: {
    title: "Admin Dashboard",
    subtitle: "Management of all incoming system reports.",
    daftar: "Recent Reports List",
    dashboard: "Dashboard",
    laporan: "Report List",
    peta: "Report Map",
    pengaturan: "Settings"
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // State untuk bahasa
  const [selectedLang, setSelectedLang] = useState('id');
  const lang = t[selectedLang];

  const [laporan] = useState([
    { id: 1, judul: "Jalan berlubang di depan sekolah", kategori: "Jalan", lokasi: "Jakarta Selatan", kerusakan: "Berat", status: "baru", tanggal: "19 Mei 2026", waktu: "10:30", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80" },
    { id: 2, judul: "Kerusakan trotoar di Jl. Melati", kategori: "Trotoar", lokasi: "Jakarta Selatan", kerusakan: "Sedang", status: "diproses", tanggal: "19 Mei 2026", waktu: "09:15", image: "https://images.unsplash.com/photo-1496354854580-5a3d76b1f24c?auto=format&fit=crop&w=100&q=80" },
    { id: 3, judul: "Lampu jalan mati di Jl. Kenanga", kategori: "Penerangan", lokasi: "Jakarta Selatan", kerusakan: "Ringan", status: "diproses", tanggal: "18 Mei 2026", waktu: "21:45", image: "https://images.unsplash.com/photo-1617369165682-1200021b36fa?auto=format&fit=crop&w=100&q=80" },
    { id: 4, judul: "Pipa bocor di area pasar", kategori: "Air", lokasi: "Jakarta Timur", kerusakan: "Berat", status: "baru", tanggal: "17 Mei 2026", waktu: "08:00", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=100&q=80" },
    { id: 5, judul: "Sampah menumpuk di taman", kategori: "Kebersihan", lokasi: "Jakarta Pusat", kerusakan: "Sedang", status: "selesai", tanggal: "16 Mei 2026", waktu: "14:20", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=100&q=80" },
    { id: 6, judul: "Jalan berlubang di depan sekolah", kategori: "Jalan", lokasi: "Jakarta Selatan", kerusakan: "Berat", status: "baru", tanggal: "19 Mei 2026", waktu: "10:30", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80" },
    { id: 7, judul: "Kerusakan trotoar di Jl. Melati", kategori: "Trotoar", lokasi: "Jakarta Selatan", kerusakan: "Sedang", status: "diproses", tanggal: "19 Mei 2026", waktu: "09:15", image: "https://images.unsplash.com/photo-1496354854580-5a3d76b1f24c?auto=format&fit=crop&w=100&q=80" },
    { id: 8, judul: "Lampu jalan mati di Jl. Kenanga", kategori: "Penerangan", lokasi: "Jakarta Selatan", kerusakan: "Ringan", status: "diproses", tanggal: "18 Mei 2026", waktu: "21:45", image: "https://images.unsplash.com/photo-1617369165682-1200021b36fa?auto=format&fit=crop&w=100&q=80" },
    { id: 9, judul: "Pipa bocor di area pasar", kategori: "Air", lokasi: "Jakarta Timur", kerusakan: "Berat", status: "baru", tanggal: "17 Mei 2026", waktu: "08:00", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=100&q=80" },
    { id: 10, judul: "Sampah menumpuk di taman", kategori: "Kebersihan", lokasi: "Jakarta Pusat", kerusakan: "Sedang", status: "selesai", tanggal: "16 Mei 2026", waktu: "14:20", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=100&q=80" }
  ]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
      
      <div className="w-[260px] bg-[#1E2F4D] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <Icon icon="lucide:atom" className="w-8 h-8 text-[#FFFFFF]" />
          <span className="text-xl font-bold">CitizenCare</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-[#243B63] text-white' : 'text-gray-300 hover:text-white hover:bg-[#243B63]/50'}`}>
            <Icon icon="lucide:layout-dashboard" className="w-5 h-5" /> {lang.dashboard}
          </NavLink>
          <NavLink to="/admin/laporan" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-[#243B63] text-white' : 'text-gray-300 hover:text-white hover:bg-[#243B63]/50'}`}>
            <Icon icon="lucide:file-text" className="w-5 h-5" /> {lang.laporan}
          </NavLink>
          <button onClick={() => setShowMap(true)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#243B63]/50 rounded-xl font-medium transition-colors">
            <Icon icon="lucide:map" className="w-5 h-5" /> {lang.peta}
          </button>
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#243B63]/50 rounded-xl font-medium transition-colors">
            <Icon icon="lucide:settings" className="w-5 h-5" /> {lang.pengaturan}
          </button>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#243B63]/50 rounded-xl font-medium transition-colors">
            <Icon icon="lucide:log-out" className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E2F4D] mb-2">{lang.title}</h1>
              <p className="text-gray-500 text-sm">{lang.subtitle}</p>
            </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-bold text-[#1E2F4D]">{lang.daftar}</h2>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">No</th>
                <th className="px-6 py-4 font-semibold">Nama Laporan</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Lokasi</th>
                <th className="px-6 py-4 font-semibold">Tingkat Kerusakan (AI)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {laporan.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{index + 1}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.judul} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                      <span className="text-[#1E2F4D] truncate max-w-[200px]" title={item.judul}>
                        {item.judul}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">{item.kategori}</td>
                  <td className="px-6 py-4">{item.lokasi}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.kerusakan === 'Berat' ? 'bg-red-50 text-red-600' : 
                      item.kerusakan === 'Sedang' ? 'bg-yellow-50 text-yellow-600' : 
                      'bg-green-50 text-green-600'
                    }`}>
                      <Icon icon="lucide:activity" className="w-3.5 h-3.5" />
                      {item.kerusakan}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                      item.status === 'baru' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'diproses' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{item.tanggal}</span>
                      <span className="text-gray-400 text-xs mt-0.5">{item.waktu}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMap && (
        <AdminMapModal title={lang.peta} onClose={() => setShowMap(false)} />
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-[#1E2F4D]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#F8FAFC] px-8 py-6 border-b border-[#E5E7EB] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1E2F4D]">{lang.pengaturan}</h2>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-[#243B63] uppercase tracking-wider mb-6">Pilih Bahasa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSelectedLang('id')} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${selectedLang === 'id' ? 'border-[#1E2F4D] bg-[#F8FAFC]' : 'border-[#E5E7EB]'}`}>
                    <Icon icon="twemoji:flag-indonesia" className="w-10 h-10" />
                    <span className="font-bold text-sm">Indonesia</span>
                  </button>
                  <button onClick={() => setSelectedLang('en')} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${selectedLang === 'en' ? 'border-[#1E2F4D] bg-[#F8FAFC]' : 'border-[#E5E7EB]'}`}>
                    <Icon icon="twemoji:flag-united-states" className="w-10 h-10" />
                    <span className="font-bold text-sm">English</span>
                  </button>
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-[#1E2F4D] text-white rounded-xl font-bold hover:bg-[#243B63]">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
