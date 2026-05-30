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

  const formatHistoryTime = (value) => {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1E2F4D] font-bold hover:text-[#243B63] transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            Kembali
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#1E2F4D] font-bold hover:text-[#243B63] transition-colors"
          >
            <Icon icon="lucide:log-out" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        
        {isLoading && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center text-gray-500">
            Memuat detail laporan...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && laporan && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 md:p-8">
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
                  <Icon
                    icon="lucide:file-text"
                    className="w-6 h-6 text-[#1E2F4D]"
                  />
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1E2F4D]">
                    Detail Laporan
                  </h2>
                  <p className="text-sm text-gray-500">
                    Informasi lengkap laporan warga
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-y-5 gap-x-6 text-sm md:text-base">
                
                <div className="font-semibold text-gray-500">
                  Judul Laporan
                </div>
                <div className="text-[#1E2F4D] font-bold break-words">
                  : {laporan.judul}
                </div>

                <div className="font-semibold text-gray-500">
                  Deskripsi
                </div>
                <div className="text-gray-700 leading-relaxed break-words">
                  : {laporan.deskripsi}
                </div>

                <div className="font-semibold text-gray-500">
                  Kategori
                </div>
                <div className="text-gray-700">
                  : {laporan.kategori}
                </div>

                <div className="font-semibold text-gray-500">
                  Lokasi
                </div>
                <div className="text-gray-700 break-words">
                  : {laporan.lokasi}
                </div>

                <div className="font-semibold text-gray-500">
                  Tanggal
                </div>
                <div className="text-gray-700">
                  : {laporan.tanggal}, {laporan.waktu} WIB
                </div>

                <div className="font-semibold text-gray-500">
                  Pelapor
                </div>
                <div className="text-gray-700">
                  : {laporan.pelapor || 'Masyarakat Umum'}
                </div>

                <div className="font-semibold text-gray-500">
                  Tingkat Kerusakan
                </div>

                <div>
                  :
                  <span
                    className={`ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      laporan.kerusakan === 'Berat'
                        ? 'bg-red-50 text-red-600'
                        : laporan.kerusakan === 'Sedang'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    <Icon
                      icon="lucide:activity"
                      className="w-3.5 h-3.5"
                    />
                    {laporan.kerusakan || '-'}
                  </span>
                </div>

                <div className="font-semibold text-gray-500">
                  Status
                </div>

                <div>
                  :
                  <span
                    className={`ml-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      laporan.status === 'baru'
                        ? 'bg-blue-100 text-blue-700'
                        : laporan.status === 'diproses'
                        ? 'bg-yellow-100 text-yellow-700'
                        : laporan.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {laporan.status}
                  </span>
                </div>

                <div className="font-semibold text-gray-500">
                  Sumber AI
                </div>
                <div className="text-gray-700">
                  : {laporan.aiAnalysis?.source === 'huggingface' ? 'Hugging Face' : 'Default sistem'}
                </div>

                <div className="font-semibold text-gray-500">
                  Confidence AI
                </div>
                <div className="text-gray-700">
                  : {laporan.aiAnalysis?.confidence ? `${laporan.aiAnalysis.confidence}%` : '-'}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold text-[#1E2F4D] mb-4">
                  Lampiran Gambar
                </h3>

                {laporan.image ? (
                  <img
                    src={laporan.image}
                    alt="Lampiran laporan"
                    className="w-full rounded-2xl border border-[#E5E7EB] object-cover max-h-[500px]"
                  />
                ) : (
                  <div className="w-full h-[240px] rounded-2xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center text-gray-400">
                    Tidak ada lampiran gambar.
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold text-[#1E2F4D] mb-4">
                  Riwayat Laporan
                </h3>

                {laporan.histories?.length > 0 ? (
                  <div className="space-y-3">
                    {laporan.histories.map((history) => (
                      <div key={history.id} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E2F4D] text-white">
                          <Icon icon="lucide:history" className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold capitalize text-[#1E2F4D]">
                            Status: {history.status}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatHistoryTime(history.createdAt)}
                          </p>
                          {history.note && (
                            <p className="mt-2 text-sm text-gray-600">
                              {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] p-5 text-sm text-gray-400">
                    Belum ada riwayat laporan.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 md:p-6 h-max">
              
              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#1E2F4D] mb-2">
                  Lokasi Laporan
                </h2>

                <p className="text-sm text-gray-500 break-words">
                  {laporan.lokasi}
                </p>
              </div>

              <div className="w-full h-[260px] md:h-[320px] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC]">
                
                {mapUrl ? (
                  <iframe
                    title="Peta lokasi laporan"
                    src={mapUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm text-center px-4">
                    Koordinat lokasi belum tersedia
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                <Icon
                  icon="lucide:map-pinned"
                  className="w-4 h-4 shrink-0 mt-0.5"
                />
                <p>
                  Titik lokasi mengikuti lokasi yang dikirim oleh pelapor.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
