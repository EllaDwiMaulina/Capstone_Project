import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import monasImg from '../assets/images/monas.png';
import tentangKamiImg from '../assets/images/tentang-kami.png';

export default function Beranda() {
  return (
    <div className="w-full bg-[#FFFFFF]">
      <section className="px-6 md:px-16 py-12 md:py-20 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#E5E7EB] -z-10 hidden md:block"></div>
        
        <div className="w-full md:w-1/2 text-left space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E2F4D] leading-tight">
            Laporkan Masalah<br />Kotamu dengan Mudah
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Bersama-sama membangun kota yang lebih baik, aman, dan nyaman untuk semua.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              to="/buat-laporan" 
              className="bg-[#1E2F4D] text-[#FFFFFF] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#243B63] transition-colors"
            >
              Lapor Sekarang
            </Link>
            <Link 
              to="/daftar-laporan" 
              className="bg-[#FFFFFF] text-[#1E2F4D] border-2 border-[#1E2F4D] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#E5E7EB] transition-colors"
            >
              Lihat Laporan
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 bg-[#F8FAFC] text-[#1E2F4D] border-2 border-[#E5E7EB] px-6 py-3 rounded-md font-semibold text-lg hover:border-[#1E2F4D] transition-colors"
            >
              <Icon icon="lucide:shield-check" className="w-5 h-5" />
              Dashboard Admin
            </Link>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-end">
          <img src={monasImg} alt="Ilustrasi Jakarta" className="w-full max-w-[550px] object-contain" />
        </div>
      </section>

      <section className="px-6 md:px-16 py-16 w-full bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-[#1E2F4D]">Fitur Utama</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Kami menggunakan teknologi AI untuk memproses laporan secara otomatis dan membantu admin mengambil keputusan lebih cepat.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4F8] flex items-center justify-center shrink-0">
                <Icon icon="lucide:file-edit" className="w-7 h-7 text-[#1E2F4D]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E2F4D] mb-2">Lapor Kerusakan</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Sampaikan keluhan atau masalah di sekitar Anda dengan mudah lengkap dengan foto dan lokasi.
                </p>
              </div>
            </div>
            
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4F8] flex items-center justify-center shrink-0">
                <Icon icon="lucide:bot" className="w-7 h-7 text-[#1E2F4D]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E2F4D] mb-2">Analisis AI Otomatis</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Sistem AI menganalisis laporan untuk menentukan tingkat kerusakan dan urgensi.
                </p>
              </div>
            </div>
            
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F4F8] flex items-center justify-center shrink-0">
                <Icon icon="lucide:monitor-check" className="w-7 h-7 text-[#1E2F4D]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E2F4D] mb-2">Pantau Status Laporan</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Lihat perkembangan laporan secara real-time hingga selesai ditangani.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-20 w-full bg-[#FFFFFF]">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#1E2F4D]">Cara Kerja</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              3 langkah mudah untuk perubahan di kotamu
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-between relative">
            <div className="flex-1 flex flex-col items-center text-center z-10 px-4">
              <div className="relative mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1E2F4D] text-white text-xs font-bold flex items-center justify-center absolute -top-2 -left-2 border-2 border-white z-20">1</div>
                <div className="w-28 h-28 rounded-full border-2 border-[#1E2F4D] flex items-center justify-center bg-white text-[#1E2F4D]">
                  <Icon icon="lucide:clipboard-edit" className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1E2F4D] mb-3">Kirim Laporan</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                Isi keluhan, pilih jenis infrastruktur, lokasi, dan unggah foto.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center z-10 px-4 mt-12 md:mt-0">
              <div className="relative mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1E2F4D] text-white text-xs font-bold flex items-center justify-center absolute -top-2 -left-2 border-2 border-white z-20">2</div>
                <div className="w-28 h-28 rounded-full border-2 border-[#1E2F4D] flex items-center justify-center bg-white text-[#1E2F4D]">
                  <Icon icon="lucide:bot" className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1E2F4D] mb-3">AI Menganalisis</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
                Sistem AI menganalisis laporan dan menentukan tingkat kerusakan serta tingkat urgensi.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center z-10 px-4 mt-12 md:mt-0">
              <div className="relative mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1E2F4D] text-white text-xs font-bold flex items-center justify-center absolute -top-2 -left-2 border-2 border-white z-20">3</div>
                <div className="w-28 h-28 rounded-full border-2 border-[#1E2F4D] flex items-center justify-center bg-white text-[#1E2F4D]">
                  <Icon icon="lucide:landmark" className="w-12 h-12" />
                  <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-white">
                    <Icon icon="lucide:check" className="w-4 h-4 text-white font-bold" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1E2F4D] mb-3">Ditindaklanjuti Admin</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
                Admin melihat prioritas laporan dan memperbarui status penanganan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 w-full bg-[#FFFFFF] mb-10">
        <div className="max-w-[1383px] min-h-[139px] py-8 mx-auto bg-[#E5E7EB] rounded-[24px] flex flex-wrap items-center justify-around px-8 gap-6">
          <div className="flex items-center gap-4">
            <Icon icon="lucide:file-text" className="w-8 h-8 text-[#1E2F4D]" />
            <div>
              <h4 className="text-2xl font-bold text-[#1E2F4D]">1.235+</h4>
              <p className="text-xs text-gray-600 font-medium mt-1">Total Laporan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Icon icon="lucide:alert-circle" className="w-8 h-8 text-[#F59E0B]" />
            <div>
              <h4 className="text-2xl font-bold text-[#F59E0B]">235</h4>
              <p className="text-xs text-gray-600 font-medium mt-1">Mendesak</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Icon icon="lucide:check-circle" className="w-8 h-8 text-[#10B981]" />
            <div>
              <h4 className="text-2xl font-bold text-[#10B981]">876</h4>
              <p className="text-xs text-gray-600 font-medium mt-1">Selesai Ditangani</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Icon icon="lucide:users" className="w-8 h-8 text-[#3B82F6]" />
            <div>
              <h4 className="text-2xl font-bold text-[#3B82F6]">2.540+</h4>
              <p className="text-xs text-gray-600 font-medium mt-1">Warga Terlibat</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang-kami" className="px-6 md:px-16 pb-24 pt-10 w-full bg-[#FFFFFF]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center md:justify-start">
            <img src={tentangKamiImg} alt="Ilustrasi Tentang Kami" className="w-full max-w-[550px] object-contain" />
          </div>
          <div className="space-y-4 text-left">
            <h2 className="text-3xl font-bold text-[#1E2F4D]">Tentang Kami</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              CitizenCare adalah aplikasi pelaporan kerusakan infrastruktur yang membantu masyarakat menyampaikan keluhan dengan mudah. Dengan bantuan AI, laporan dianalisis untuk menentukan tingkat kerusakan dan urgensi agar penanganan bisa lebih cepat dan tepat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
