import React from 'react';
import { Icon } from '@iconify/react';

export default function BuatLaporan() {
  return (
    <div className="bg-[#FFFFFF] min-h-screen px-6 md:px-16 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1E2F4D] mb-2">Buat Laporan</h1>
          <p className="text-gray-500">Sampaikan masalah yang Anda temui di sekitar</p>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-[#1E2F4D] mb-3">Nama Laporan</label>
              <input 
                type="text" 
                placeholder="Contoh: Jalan berlubang di depan sekolah"
                className="w-full px-4 py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-[#1E2F4D] mb-3">Deskripsi</label>
              <textarea 
                rows="6"
                placeholder="Jelaskan masalah yang Ada temui secara detail"
                className="w-full px-4 py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] resize-none transition-colors"
              ></textarea>
            </div>

            <div>
              <label className="block text-lg font-bold text-[#1E2F4D] mb-3">Upload Gambar</label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-12 flex flex-col items-center justify-center bg-[#FFFFFF] cursor-pointer hover:bg-[#E5E7EB] transition-colors">
                <Icon icon="lucide:paperclip" className="w-8 h-8 text-[#1E2F4D] mb-4" />
                <p className="text-sm text-gray-600 text-center">
                  Klik atau drag gambar ke sini<br />
                  <span className="text-xs">Format: JPG, PNG, (Max. 5MB)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-[#1E2F4D] mb-3">Lokasi</label>
              <input 
                type="text" 
                placeholder="Contoh: Jakarta Timur"
                className="w-full px-4 py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] transition-colors mb-4"
              />
              
              <div className="w-full h-[250px] bg-[#E5E7EB] rounded-t-xl overflow-hidden relative border-x-2 border-t-2 border-[#E5E7EB]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#1E2F4D] font-medium text-center px-4">Peta akan tampil di sini (Gunakan Leaflet/Google Maps API)</span>
                </div>
              </div>
              <div className="w-full py-3 px-4 bg-[#FFFFFF] border-2 border-[#E5E7EB] rounded-b-xl">
                <p className="text-[10px] text-[#1E2F4D] italic">Titik lokasi mengikuti lokasi yang dikirim oleh pelapor</p>
              </div>
            </div>

            <div className="pt-8">
              <div className="relative mb-8">
                <select className="w-full px-4 py-4 rounded-xl border-2 border-[#E5E7EB] appearance-none outline-none focus:border-[#1E2F4D] text-gray-500 bg-[#FFFFFF]">
                  <option value="">Pilih Kategori</option>
                  <option value="jalan">Jalan Rusak</option>
                  <option value="sampah">Sampah</option>
                  <option value="fasilitas">Fasilitas Umum</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1E2F4D]">
                  <Icon icon="lucide:chevron-down" className="w-6 h-6" />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-[#1E2F4D] text-[#FFFFFF] rounded-xl font-bold text-xl hover:bg-[#243B63] transition-colors"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}