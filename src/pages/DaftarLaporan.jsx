import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function DaftarLaporan() {
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const laporanData = [
    { id: 1, judul: "Jalan Rusak Parah", kategori: "Infrastruktur", lokasi: "Jakarta Pusat", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Terdapat lubang besar di tengah jalan utama yang sangat membahayakan.", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=500&q=80" },
    { id: 2, judul: "Pipa Air Bocor", kategori: "Infrastruktur", lokasi: "Jakarta Utara", status: "Pending", statusColor: "bg-amber-100 text-amber-700", deskripsi: "Pipa PDAM pecah menyebabkan genangan air di trotoar.", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80" },
    { id: 3, judul: "Halte Rusak", kategori: "Fasilitas Umum", lokasi: "Jakarta Selatan", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Atap halte copot dan kursi tunggu patah.", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=500&q=80" },
    { id: 4, judul: "Lampu PJU Mati", kategori: "Fasilitas Umum", lokasi: "Jakarta Timur", status: "Selesai", statusColor: "bg-green-100 text-green-700", deskripsi: "Lampu penerangan jalan mati total selama seminggu.", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=500&q=80" },
    { id: 5, judul: "Tumpukan Sampah", kategori: "Kebersihan", lokasi: "Jakarta Pusat", status: "Pending", statusColor: "bg-amber-100 text-amber-700", deskripsi: "Sampah liar menumpuk di pinggir jalan raya.", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=80" },
    { id: 6, judul: "Pohon Tumbang", kategori: "Lingkungan", lokasi: "Jakarta Barat", status: "Selesai", statusColor: "bg-green-100 text-green-700", deskripsi: "Pohon besar tumbang menutupi setengah badan jalan.", image: "https://images.unsplash.com/photo-1592753054398-9fd6ebc689b1?auto=format&fit=crop&w=500&q=80" },
    { id: 7, judul: "Trotoar Ambles", kategori: "Infrastruktur", lokasi: "Jakarta Timur", status: "Pending", statusColor: "bg-amber-100 text-amber-700", deskripsi: "Trotoar jalan ambles ke arah selokan.", image: "https://images.unsplash.com/photo-1496354854580-5a3d76b1f24c?auto=format&fit=crop&w=500&q=80" },
    { id: 8, judul: "Tiang Listrik Miring", kategori: "Fasilitas Umum", lokasi: "Jakarta Utara", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Tiang listrik miring tertiup angin kencang.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80" },
    { id: 9, judul: "Jembatan Penyeberangan Rusak", kategori: "Infrastruktur", lokasi: "Jakarta Pusat", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Tangga JPO sudah berkarat dan berlubang.", image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=500&q=80" },
    { id: 10, judul: "Pagar Taman Hilang", kategori: "Lingkungan", lokasi: "Jakarta Pusat", status: "Selesai", statusColor: "bg-green-100 text-green-700", deskripsi: "Pagar pembatas taman dicuri orang tidak dikenal.", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80" },
    { id: 11, judul: "Saluran Air Tersumbat", kategori: "Kebersihan", lokasi: "Jakarta Barat", status: "Pending", statusColor: "bg-amber-100 text-amber-700", deskripsi: "Air selokan meluap saat hujan turun.", image: "https://images.unsplash.com/photo-1516912481808-34061f8c03c2?auto=format&fit=crop&w=500&q=80" },
    { id: 12, judul: "Aspal Mengelupas", kategori: "Infrastruktur", lokasi: "Jakarta Timur", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Aspal jalan baru tapi sudah mengelupas parah.", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=500&q=80" },
    { id: 13, judul: "Coretan Fasilitas", kategori: "Fasilitas Umum", lokasi: "Jakarta Selatan", status: "Selesai", statusColor: "bg-green-100 text-green-700", deskripsi: "Vandalisme di tembok jembatan layang.", image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=500&q=80" },
    { id: 14, judul: "Lampu Merah Error", kategori: "Fasilitas Umum", lokasi: "Jakarta Utara", status: "Pending", statusColor: "bg-amber-100 text-amber-700", deskripsi: "Lampu lalu lintas hanya berkedip kuning.", image: "https://images.unsplash.com/photo-1510133769068-d0694e773489?auto=format&fit=crop&w=500&q=80" },
    { id: 15, judul: "Kabel Listrik Menjuntai", kategori: "Fasilitas Umum", lokasi: "Jakarta Barat", status: "Diproses", statusColor: "bg-blue-100 text-blue-700", deskripsi: "Kabel menjuntai hampir menyentuh tanah.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80" }
  ];

  const filteredData = laporanData.filter(item => {
    const matchesStatus = filterStatus === "" ? true : item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(laporanData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
            <Icon icon="lucide:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4 mb-10 min-h-[450px]">
          {currentData.length > 0 ? (
            currentData.map((item) => (
              <div key={item.id} className="bg-[#E5E7EB] rounded-[16px] flex flex-col md:flex-row items-center gap-6 overflow-hidden pr-6 border border-transparent hover:border-[#1E2F4D] transition-all">
                <img src={item.image} alt={item.judul} className="w-full md:w-[220px] h-[130px] object-cover shrink-0" />
                <div className="flex-1 w-full py-4">
                  <h3 className="text-[17px] font-bold text-slate-800">{item.judul}</h3>
                  <p className="text-[13px] text-gray-600 mt-1">Kategori: {item.kategori}</p>
                  <p className="text-[13px] text-gray-600">Lokasi: {item.lokasi}</p>
                </div>
                <button onClick={() => setSelectedLaporan(item)} className="text-[#1E2F4D] font-bold text-[15px] hover:text-[#243B63] transition-colors">
                  Lihat Detail
                </button>
              </div>
            ))
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-400">
              <Icon icon="lucide:search-x" className="w-12 h-12 mb-3 opacity-50" />
              <p>Laporan tidak ditemukan.</p>
            </div>
          )}
        </div>

        {totalPages > 0 && (
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
              <img src={selectedLaporan.image} alt={selectedLaporan.judul} className="w-full h-[280px] object-cover" />
              <button onClick={() => setSelectedLaporan(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
                <Icon icon="lucide:x" className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{selectedLaporan.judul}</h2>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedLaporan.statusColor}`}>
                  {selectedLaporan.status}
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