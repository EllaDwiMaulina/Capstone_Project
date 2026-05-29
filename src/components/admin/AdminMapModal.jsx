import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminMapModal({ title = 'Peta Laporan', onClose }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMapReports() {
      try {
        const response = await fetch(`${API_URL}/api/reports/map`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memuat data peta.');
        }

        if (isMounted) {
          setReports(result.data);
          setSelectedReport(result.data[0] || null);
        }
      } catch (mapError) {
        if (isMounted) {
          setError(
            mapError.message === 'Failed to fetch'
              ? 'Backend belum berjalan. Jalankan npm run server atau npm run dev:full.'
              : mapError.message,
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMapReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapUrl = useMemo(() => {
    if (!selectedReport) {
      return '';
    }

    const latitude = Number(selectedReport.latitude);
    const longitude = Number(selectedReport.longitude);
    const offset = 0.03;
    const bbox = [
      longitude - offset,
      latitude - offset,
      longitude + offset,
      latitude + offset,
    ].join(',');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  }, [selectedReport]);

  return (
    <div className="fixed inset-0 bg-[#1E2F4D]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-[#F8FAFC] px-8 py-6 border-b border-[#E5E7EB] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#1E2F4D]">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">Koordinat lokasi diproses melalui OpenCage Geocoding API.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors">
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
          <div className="min-h-[430px] bg-gray-100">
            {isLoading && (
              <div className="h-full min-h-[430px] flex items-center justify-center text-gray-500">
                Memuat peta...
              </div>
            )}

            {!isLoading && error && (
              <div className="h-full min-h-[430px] flex flex-col items-center justify-center text-red-600 px-8 text-center">
                <Icon icon="lucide:circle-alert" className="w-10 h-10 mb-3" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {!isLoading && !error && selectedReport && (
              <iframe
                title={`Peta ${selectedReport.judul}`}
                src={mapUrl}
                className="w-full h-[430px] border-0"
                loading="lazy"
              />
            )}

            {!isLoading && !error && !selectedReport && (
              <div className="h-full min-h-[430px] flex flex-col items-center justify-center text-gray-500 px-8 text-center">
                <Icon icon="lucide:map-pin-off" className="w-10 h-10 mb-3" />
                <p className="font-semibold">Belum ada laporan yang memiliki koordinat.</p>
              </div>
            )}
          </div>

          <aside className="border-l border-[#E5E7EB] p-5 max-h-[430px] overflow-auto">
            <h3 className="text-sm font-bold text-[#1E2F4D] mb-4">Lokasi Laporan</h3>
            <div className="space-y-3">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedReport?.id === report.id
                      ? 'border-[#1E2F4D] bg-[#F8FAFC]'
                      : 'border-[#E5E7EB] hover:border-[#1E2F4D]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon icon="lucide:map-pin" className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-[#1E2F4D]">{report.judul}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.lokasi}</p>
                      <p className="text-[11px] text-gray-400 mt-2">
                        {Number(report.latitude).toFixed(5)}, {Number(report.longitude).toFixed(5)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="px-8 py-5 border-t border-[#E5E7EB] flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-[#1E2F4D] text-white rounded-xl font-bold hover:bg-[#243B63]">
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
}
