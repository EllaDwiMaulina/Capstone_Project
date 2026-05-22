import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function DetailLaporan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-5">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-800 hover:text-[#1E2F4D] font-bold transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm h-max">
          <div className="flex items-center gap-3 mb-6">
            <Icon icon="lucide:user-square-2" className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-800">Informasi Lanjut</h2>
          </div>
          
          <div className="grid grid-cols-[180px_1fr] gap-y-4 mb-6 text-sm">
            <div className="text-gray-500">Judul laporan</div>
            <div className="font-bold text-slate-800 text-base">: Jalan Berlubang di Depan Sekolah</div>
            
            <div className="text-gray-500">Deskripsi</div>
            <div className="text-slate-800 leading-relaxed">
              : Terdapat lubang cukup besar di jalan depan sekolah yang memebahayakan pengendara, terutama saat hujan
            </div>
            
            <div className="text-gray-500">Kategori</div>
            <div className="text-slate-800">: Jalan</div>
            
            <div className="text-gray-500">Tanggal Laporan</div>
            <div className="text-slate-800">: 04 Mei 2026, 10.30 WIB</div>
            
            <div className="text-gray-500">Pelapor</div>
            <div className="text-slate-800">: Masyarakat Umum</div>
            
            <div className="text-gray-500">Tingkat Kerusakan</div>
            <div className="text-slate-800">: Berat</div>
            
            <div className="text-gray-500">Prioritas</div>
            <div className="text-slate-800">: High</div>
          </div>
          
          <div className="text-gray-500 text-sm mb-4">Lampiran Gambar</div>
          <img 
            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" 
            alt="Lampiran" 
            className="w-full max-w-2xl h-auto object-cover rounded-xl border border-gray-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-max">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Lokasi Laporan</h2>
          <p className="text-sm text-gray-600 mb-4">Jl. Pemuda No.45, Rawamangun, Jakarta Timur, DKI Jakarta</p>
          
          <div className="w-full h-[250px] bg-[#E5F3F1] rounded-xl overflow-hidden relative border border-gray-200 mb-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50">
              <span className="text-blue-800/40 font-bold text-lg select-none">PETA INDONESIA</span>
              <div className="absolute drop-shadow-xl animate-bounce">
                <Icon icon="lucide:map-pin" className="w-12 h-12 text-red-600 fill-red-600" />
                <div className="w-4 h-4 bg-white rounded-full absolute top-3 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 italic">Titik lokasi mengikuti lokasi yang dikirim oleh pelapor.</p>
        </div>

      </div>
    </div>
  );
}