import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { clearAdminSession } from '../../utils/adminAuth.js';
import AdminMapModal from '../../components/admin/AdminMapModal.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Kamus bahasa untuk fitur dinamis
const t = {
  id: {
    title: "Daftar Laporan Warga",
    subtitle: "Manajemen interaktif laporan masuk dan pembaruan status.",
    dashboard: "Dashboard",
    laporan: "Daftar Laporan",
    peta: "Peta Laporan",
    pengaturan: "Pengaturan"
  },
  en: {
    title: "Citizen Report List",
    subtitle: "Interactive management of incoming reports and status updates.",
    dashboard: "Dashboard",
    laporan: "Report List",
    peta: "Report Map",
    pengaturan: "Settings"
  }
};

export default function DaftarLaporanAdmin() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLang, setSelectedLang] = useState('id');
  const lang = t[selectedLang];
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [dateFilter, setDateFilter] = useState('');
  const [laporan, setLaporan] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ sort: sortOrder, limit: '100' });

        if (dateFilter) {
          params.set('date', dateFilter);
        }

        const response = await fetch(`${API_URL}/api/reports?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memuat laporan.');
        }

        if (isMounted) {
          setLaporan(result.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Backend belum berjalan. Jalankan npm run server atau npm run dev:full.'
              : loadError.message,
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, [sortOrder, dateFilter]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  const handleStatusChange = async (id, status) => {
    setLaporan((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));

    try {
      const response = await fetch(`${API_URL}/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal memperbarui status.');
      }
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
      
      {/* Sidebar Navigation */}
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E2F4D] mb-2">{lang.title}</h1>
            <p className="text-gray-500 text-sm">{lang.subtitle}</p>
          </div>
          <div className="flex gap-3">
            {/* Filter Kalender */}
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1E2F4D] focus:outline-none" 
            />
            {/* Filter Terbaru/Terlama */}
            <div className="relative">
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)} 
                className="pl-4 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] appearance-none outline-none focus:border-[#1E2F4D] text-[#1E2F4D] text-sm bg-white cursor-pointer font-medium shadow-sm"
              >
                <option value="terbaru">Laporan Terbaru</option>
                <option value="terlama">Laporan Terlama</option>
              </select>
              <Icon icon="lucide:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabel Data Laporan */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm text-gray-600">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">No</th>
                <th className="px-6 py-4 font-semibold">Nama Laporan</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Lokasi</th>
                <th className="px-6 py-4 font-semibold">Tingkat Kerusakan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">Memuat laporan...</td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-red-600">{error}</td>
                </tr>
              )}

              {!isLoading && !error && laporan.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">Belum ada laporan.</td>
                </tr>
              )}

              {!isLoading && !error && laporan.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.judul} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                      <span className="text-[#1E2F4D] truncate max-w-[200px]" title={item.judul}>{item.judul}</span>
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
                    {/* Dropdown Status */}
                    <select 
                      value={item.status} 
                      onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                      className={`px-3 py-1.5 pr-8 rounded-full text-xs font-semibold outline-none cursor-pointer border border-transparent shadow-sm ${
                        item.status === 'baru' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'diproses' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      <option value="baru" className="bg-white text-gray-800">Baru</option>
                      <option value="diproses" className="bg-white text-gray-800">Diproses</option>
                      <option value="pending" className="bg-white text-gray-800">Pending</option>
                      <option value="selesai" className="bg-white text-gray-800">Selesai</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{item.tanggal}</span>
                      <span className="text-gray-400 text-xs mt-0.5">{item.waktu}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <NavLink to={`/admin/laporan/${item.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-gray-600 hover:bg-[#1E2F4D] hover:text-white transition-all mx-auto shadow-sm">
                      <Icon icon="lucide:eye" className="w-4 h-4" />
                      <span className="text-xs font-bold">Detail</span>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Peta Laporan */}
      {showMap && (
        <AdminMapModal title={lang.peta} onClose={() => setShowMap(false)} />
      )}

      {/* Modal Pengaturan Sistem (Pilihan Bahasa) */}
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
