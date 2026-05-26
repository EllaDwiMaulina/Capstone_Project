import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusStyle = {
  baru: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  diproses: 'bg-blue-100 text-blue-700',
  selesai: 'bg-green-100 text-green-700',
};

function formatStatus(status) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';
}

export default function DaftarLaporan() {
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [laporanData, setLaporanData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          sort: 'terbaru',
          limit: '100',
        });

        if (filterStatus) {
          params.set('status', filterStatus);
        }

        if (searchTerm.trim()) {
          params.set('q', searchTerm.trim());
        }

        const response = await fetch(`${API_URL}/api/reports?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memuat laporan.');
        }

        if (isMounted) {
          setLaporanData(result.data);
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
  }, [filterStatus, searchTerm]);

  const totalPages = Math.max(Math.ceil(laporanData.length / itemsPerPage), 1);
  const currentData = laporanData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen px-6 md:px-16 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#1E2F4D] mb-1">Daftar Laporan</h1>
          <p className="text-gray-500 text-[15px]">Berikut adalah laporan yang telah dikirim oleh masyarakat</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:max-w-[400px]">
            <Icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari Laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#1E2F4D] text-sm text-gray-700 transition-all"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] appearance-none outline-none focus:border-[#1E2F4D] text-gray-500 text-sm bg-white cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="baru">Baru</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4 mb-10 min-h-[450px]">
          {isLoading && (
            <div className="w-full py-16 flex items-center justify-center text-gray-400">Memuat laporan...</div>
          )}

          {!isLoading && error && (
            <div className="w-full py-16 flex items-center justify-center text-red-600">{error}</div>
          )}

          {!isLoading && !error && currentData.length > 0 && (
            currentData.map((item) => (
              <div key={item.id} className="bg-[#E5E7EB] rounded-[16px] flex flex-col md:flex-row items-center gap-6 overflow-hidden pr-6 border border-transparent hover:border-[#1E2F4D] transition-all">
                <img src={item.image || item.imageUrl} alt={item.judul} className="w-full md:w-[220px] h-[130px] object-cover shrink-0 bg-gray-200" />
                <div className="flex-1 w-full py-4">
                  <h3 className="text-[17px] font-bold text-slate-800">{item.judul}</h3>
                  <p className="text-[13px] text-gray-600 mt-1">Kategori: {item.kategori}</p>
                  <p className="text-[13px] text-gray-600">Lokasi: {item.lokasi}</p>
                  <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold ${statusStyle[item.status] || 'bg-gray-100 text-gray-700'}`}>
                    {formatStatus(item.status)}
                  </span>
                </div>
                <button onClick={() => setSelectedLaporan(item)} className="text-[#1E2F4D] font-bold text-[15px] hover:text-[#243B63] transition-colors">
                  Lihat Detail
                </button>
              </div>
            ))
          )}

          {!isLoading && !error && currentData.length === 0 && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-400">
              <Icon icon="lucide:search-x" className="w-12 h-12 mb-3 opacity-50" />
              <p>Laporan tidak ditemukan.</p>
            </div>
          )}
        </div>

        {!isLoading && !error && laporanData.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentPage === index + 1 ? 'bg-[#1E2F4D] text-white' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedLaporan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative">
              <img src={selectedLaporan.image || selectedLaporan.imageUrl} alt={selectedLaporan.judul} className="w-full h-[280px] object-cover bg-gray-200" />
              <button onClick={() => setSelectedLaporan(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
                <Icon icon="lucide:x" className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{selectedLaporan.judul}</h2>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyle[selectedLaporan.status] || 'bg-gray-100 text-gray-700'}`}>
                  {formatStatus(selectedLaporan.status)}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedLaporan.deskripsi}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <Icon icon="lucide:map-pin" className="w-5 h-5 text-[#1E2F4D]" />
                  <span className="text-sm font-medium">{selectedLaporan.lokasi}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Icon icon="lucide:tag" className="w-5 h-5 text-[#1E2F4D]" />
                  <span className="text-sm font-medium">{selectedLaporan.kategori}</span>
                </div>
              </div>
              <button onClick={() => setSelectedLaporan(null)} className="w-full py-3 bg-[#1E2F4D] text-white rounded-xl font-bold hover:bg-[#243B63] transition-colors">
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
