import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { clearAdminSession } from '../../utils/adminAuth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DetailLaporan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadReportDetail() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/api/reports/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memuat detail laporan.');
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

    loadReportDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const mapUrl = useMemo(() => {
    if (!laporan?.latitude || !laporan?.longitude) {
      return '';
    }

    const latitude = Number(laporan.latitude);
    const longitude = Number(laporan.longitude);
    const offset = 0.03;
    const bbox = [
      longitude - offset,
      latitude - offset,
      longitude + offset,
      latitude + offset,
    ].join(',');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  }, [laporan]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-800 hover:text-[#1E2F4D] font-bold transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            Kembali
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-700 hover:text-[#1E2F4D] font-bold transition-colors"
          >
            <Icon icon="lucide:log-out" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 mt-8">
        {isLoading && <div className="bg-white rounded-2xl p-10 text-center text-gray-500">Memuat detail laporan...</div>}
        {!isLoading && error && <div className="bg-white rounded-2xl p-10 text-center text-red-600">{error}</div>}

        {!isLoading && !error && laporan && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm h-max">
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="lucide:user-square-2" className="w-6 h-6 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-800">Informasi Lanjut</h2>
              </div>

              <div className="grid grid-cols-[180px_1fr] gap-y-4 mb-6 text-sm">
                <div className="text-gray-500">Judul laporan</div>
                <div className="font-bold text-slate-800 text-base">: {laporan.judul}</div>

                <div className="text-gray-500">Deskripsi</div>
                <div className="text-slate-800 leading-relaxed">: {laporan.deskripsi}</div>

                <div className="text-gray-500">Kategori</div>
                <div className="text-slate-800">: {laporan.kategori}</div>

                <div className="text-gray-500">Tanggal Laporan</div>
                <div className="text-slate-800">: {laporan.tanggal}, {laporan.waktu} WIB</div>

                <div className="text-gray-500">Pelapor</div>
                <div className="text-slate-800">: {laporan.pelapor || 'Masyarakat Umum'}</div>

                <div className="text-gray-500">Tingkat Kerusakan</div>
                <div className="text-slate-800">: {laporan.kerusakan || '-'}</div>

                <div className="text-gray-500">Status</div>
                <div className="text-slate-800 capitalize">: {laporan.status}</div>
              </div>

              <div className="text-gray-500 text-sm mb-4">Lampiran Gambar</div>
              {laporan.image ? (
                <img
                  src={laporan.image}
                  alt="Lampiran"
                  className="w-full max-w-2xl h-auto object-cover rounded-xl border border-gray-200"
                />
              ) : (
                <div className="w-full max-w-2xl h-[220px] rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  Tidak ada lampiran gambar.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-max">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Lokasi Laporan</h2>
              <p className="text-sm text-gray-600 mb-4">{laporan.lokasi}</p>

              <div className="w-full h-[250px] bg-[#E5F3F1] rounded-xl overflow-hidden relative border border-gray-200 mb-4">
                {mapUrl ? (
                  <iframe title="Peta lokasi laporan" src={mapUrl} className="w-full h-full border-0" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50">
                    <span className="text-blue-800/40 font-bold text-lg select-none">Koordinat belum tersedia</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 italic">Titik lokasi mengikuti lokasi yang dikirim oleh pelapor.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
