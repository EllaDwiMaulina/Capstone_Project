import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className="bg-[#1E2F4D] text-[#FFFFFF] pt-16 pb-8 px-6 md:px-16 w-full">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4 pr-4">
          <div className="flex items-center gap-2.5">
            <Icon icon="lucide:atom" className="w-8 h-8 text-[#FFFFFF]" />
            <span className="text-2xl font-bold">CitizenCare</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            CitizenCare membantu masyarakat melaporkan kerusakan infrastruktur dengan mudah dan cepat untuk menciptakan kota yang lebih baik.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Menu</h4>
          <div className="flex flex-col space-y-3 text-sm text-gray-300">
            <Link to="/" className="hover:text-[#FFFFFF] transition-colors">Beranda</Link>
            <a href="#fitur" className="hover:text-[#FFFFFF] transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-[#FFFFFF] transition-colors">Cara Kerja</a>
            <a href="#tentang-kami" className="hover:text-[#FFFFFF] transition-colors">Tentang Kami</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">Informasi</h4>
          <div className="flex flex-col space-y-3 text-sm text-gray-300">
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">• Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">• Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">• FAQ</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">Hubungi Kami</h4>
          <div className="flex flex-col space-y-3 text-sm text-gray-300">
            <p>support@citizencare.id</p>
            <p>(021) 1234 5678</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <hr className="border-t border-gray-400/30 mb-8" />
        <hr className="border-t border-gray-400/30 mb-6" />
        <div className="text-center text-sm text-gray-300">
          © 2026 CitizenCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}