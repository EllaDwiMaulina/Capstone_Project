import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

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
  const [showSettings, setShowSettings] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLang, setSelectedLang] = useState('id');
  const lang = t[selectedLang];
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [dateFilter, setDateFilter] = useState(''); 

  const [laporan, setLaporan] = useState(Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    judul: `Laporan Infrastruktur ${i + 1}`,
    kategori: i % 2 === 0 ? "Jalan" : "Air",
    lokasi: "Jakarta Selatan",
    kerusakan: i % 3 === 0 ? "Berat" : i % 3 === 1 ? "Sedang" : "Ringan",
    status: i % 4 === 0 ? "baru" : i % 4 === 1 ? "diproses" : i % 4 === 2 ? "pending" : "selesai",
    tanggal: "2026-05-19",
    waktu: "10:30",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80"
  })));

  const filteredData = useMemo(() => {
    let data = [...laporan];
    if (dateFilter) {
      data = data.filter(item => item.tanggal === dateFilter);
    }
    return data.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
    });
  }, [laporan, sortOrder, dateFilter]);

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
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
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
              {filteredData.map((item, index) => (
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
                      onChange={(e) => setLaporan(laporan.map(l => l.id === item.id ? {...l, status: e.target.value} : l))} 
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
                    {/* Tombol Aksi Ikon Mata */}
                    <NavLink to={`/admin/laporan/${item.id}`} className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-[#1E2F4D] hover:text-white transition-all mx-auto shadow-sm">
                      <Icon icon="lucide:eye" className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-[#1E2F4D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#F8FAFC] px-8 py-6 border-b border-[#E5E7EB] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1E2F4D]">{lang.peta}</h2>
              <button onClick={() => setShowMap(false)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <Icon icon="lucide:map-pin" className="w-12 h-12 text-[#1E2F4D] mb-4 opacity-30" />
                <p className="text-gray-400 font-medium">Modul Peta Interaktif</p>
              </div>
              <button onClick={() => setShowMap(false)} className="mt-6 w-full py-3 bg-[#1E2F4D] text-white rounded-xl font-bold hover:bg-[#243B63]">
                Tutup Peta
              </button>
            </div>
          </div>
        </div>
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