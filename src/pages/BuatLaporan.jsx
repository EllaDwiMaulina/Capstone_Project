import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BuatLaporan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialLatitude = searchParams.get('latitude');
  const initialLongitude = searchParams.get('longitude');
  const initialLocation = searchParams.get('lokasi') || '';

  const [lokasi, setLokasi] = useState(initialLocation);

  const [mapPoint, setMapPoint] = useState(
    initialLatitude && initialLongitude
      ? {
          latitude: initialLatitude,
          longitude: initialLongitude,
          formatted: initialLocation,
        }
      : null,
  );

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [mapError, setMapError] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapUrl = useMemo(() => {
    if (!mapPoint) {
      return '';
    }

    const latitude = Number(mapPoint.latitude);
    const longitude = Number(mapPoint.longitude);
    const offset = 0.03;

    const bbox = [
      longitude - offset,
      latitude - offset,
      longitude + offset,
      latitude + offset,
    ].join(',');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  }, [mapPoint]);

  const handleCheckLocation = async () => {
    if (!lokasi.trim()) {
      setMapError('Masukkan lokasi terlebih dahulu.');
      return;
    }

    setIsGeocoding(true);
    setMapError('');

    try {
      const response = await fetch(
        `${API_URL}/api/geocode?q=${encodeURIComponent(lokasi)}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lokasi tidak ditemukan.');
      }

      setMapPoint(result.data);
    } catch (error) {
      setMapPoint(null);

      setMapError(
        error.message === 'Failed to fetch'
          ? 'Backend belum berjalan. Jalankan npm run server atau npm run dev:full.'
          : error.message,
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setFormError('');

    if (!file) {
      setSelectedImage(null);
      setImagePreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFormError(
        'File harus berupa gambar JPG, PNG, atau format gambar lain.',
      );

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran gambar maksimal 5MB.');

      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError('');

    if (
      !formData.judul.trim() ||
      !formData.deskripsi.trim() ||
      !formData.kategori ||
      !lokasi.trim()
    ) {
      setFormError(
        'Nama laporan, deskripsi, kategori, dan lokasi wajib diisi.',
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      payload.append('judul', formData.judul.trim());
      payload.append('deskripsi', formData.deskripsi.trim());
      payload.append('kategori', formData.kategori);
      payload.append('lokasi', lokasi.trim());

      if (mapPoint?.latitude && mapPoint?.longitude) {
        payload.append('latitude', mapPoint.latitude);
        payload.append('longitude', mapPoint.longitude);
      }

      if (selectedImage) {
        payload.append('image', selectedImage);
      }

      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim laporan.');
      }

      setFormData({
        judul: '',
        deskripsi: '',
        kategori: '',
      });

      setLokasi('');
      setMapPoint(null);
      setSelectedImage(null);
      setImagePreview('');
      setShowSuccessModal(true);
    } catch (error) {
      setFormError(
        error.message === 'Failed to fetch'
          ? 'Backend belum berjalan. Jalankan npm run server atau npm run dev:full.'
          : error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen px-4 sm:px-6 md:px-16 py-10 md:py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E2F4D] mb-2">
            Buat Laporan
          </h1>

          <p className="text-gray-500">
            Sampaikan masalah yang Anda temui di sekitar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          <div className="space-y-8">
            <div>
              <label className="block text-base md:text-lg font-bold text-[#1E2F4D] mb-3">
                Nama Laporan
              </label>

              <input
                name="judul"
                type="text"
                value={formData.judul}
                onChange={handleInputChange}
                placeholder="Contoh: Jalan berlubang di depan sekolah"
                className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-base md:text-lg font-bold text-[#1E2F4D] mb-3">
                Deskripsi
              </label>

              <textarea
                name="deskripsi"
                rows="6"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Jelaskan masalah yang Ada temui secara detail"
                className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] resize-none transition-colors"
              ></textarea>
            </div>

            <div>
              <label className="block text-base md:text-lg font-bold text-[#1E2F4D] mb-3">
                Upload Gambar
              </label>

              <label className="border-2 border-dashed border-[#E5E7EB] rounded-xl min-h-[220px] md:min-h-[240px] p-4 md:p-6 flex flex-col items-center justify-center bg-[#FFFFFF] cursor-pointer hover:bg-[#F8FAFC] transition-colors overflow-hidden">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Preview gambar laporan"
                      className="w-full h-[160px] md:h-[180px] object-cover rounded-xl border border-[#E5E7EB]"
                    />

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-sm text-[#1E2F4D] font-semibold truncate">
                        {selectedImage?.name}
                      </p>

                      <span className="text-xs text-gray-500 shrink-0">
                        Klik untuk ganti
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Icon
                      icon="lucide:image-plus"
                      className="w-9 h-9 text-[#1E2F4D] mb-4"
                    />

                    <p className="text-sm text-gray-600 text-center">
                      Klik untuk memilih gambar laporan
                      <br />

                      <span className="text-xs">
                        Format: JPG, PNG, WebP (Max. 5MB)
                      </span>
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview('');
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
                >
                  <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  Hapus gambar
                </button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-base md:text-lg font-bold text-[#1E2F4D] mb-3">
                Lokasi
              </label>

              <input
                type="text"
                placeholder="Contoh: Jakarta Timur"
                value={lokasi}
                onChange={(event) => setLokasi(event.target.value)}
                className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-[#E5E7EB] outline-none focus:border-[#1E2F4D] transition-colors mb-4"
              />

              <div className="w-full h-[220px] md:h-[250px] bg-[#E5E7EB] rounded-t-xl overflow-hidden relative border-x-2 border-t-2 border-[#E5E7EB]">
                {mapPoint ? (
                  <iframe
                    title="Preview lokasi laporan"
                    src={mapUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#1E2F4D] font-medium text-center px-4">
                      Peta akan tampil setelah lokasi dicek
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full py-3 px-4 bg-[#FFFFFF] border-2 border-[#E5E7EB] rounded-b-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <p className="text-xs text-[#1E2F4D] italic break-words">
                    {mapPoint
                      ? `${mapPoint.formatted || lokasi} (${Number(
                          mapPoint.latitude,
                        ).toFixed(5)}, ${Number(
                          mapPoint.longitude,
                        ).toFixed(5)})`
                      : 'Titik lokasi mengikuti hasil geocoding OpenCage dari lokasi yang dikirim.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckLocation}
                    disabled={isGeocoding}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1E2F4D] text-white rounded-lg text-xs font-bold hover:bg-[#243B63] disabled:opacity-70"
                  >
                    <Icon icon="lucide:map-pin" className="w-4 h-4" />

                    {isGeocoding ? 'Mengecek...' : 'Cek Lokasi'}
                  </button>
                </div>

                {mapError && (
                  <p className="text-xs text-red-600 mt-2">{mapError}</p>
                )}
              </div>
            </div>

            <div className="pt-8">
              <div className="relative mb-8">
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-[#E5E7EB] appearance-none outline-none focus:border-[#1E2F4D] text-gray-500 bg-[#FFFFFF]"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Jalan">Jalan</option>
                  <option value="Trotoar">Trotoar</option>
                  <option value="Jembatan">Jembatan</option>
                  <option value="Drainase">Drainase</option>
                  <option value="Lampu Jalan">Lampu Jalan</option>
                  <option value="Kabel Fiber">Kabel Fiber</option>
                  <option value="Taman">Taman</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1E2F4D]">
                  <Icon icon="lucide:chevron-down" className="w-6 h-6" />
                </div>
              </div>

              {formError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <Icon
                    icon="lucide:circle-alert"
                    className="w-5 h-5 shrink-0"
                  />

                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 bg-[#1E2F4D] text-[#FFFFFF] rounded-xl font-bold text-lg md:text-xl hover:bg-[#243B63] transition-colors disabled:opacity-70"
              >
                {isSubmitting
                  ? 'Mengirim Laporan...'
                  : 'Kirim Laporan'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Icon icon="lucide:check" className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-bold text-[#1E2F4D]">
              Laporan Berhasil Dikirim
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Terima kasih. Laporan Anda sudah masuk dan akan diproses oleh admin.
            </p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-7 w-full rounded-xl bg-[#1E2F4D] py-3 font-bold text-white transition-colors hover:bg-[#243B63]"
            >
              OKE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}