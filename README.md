# CitizenCare

## Deskripsi Singkat Proyek

CitizenCare adalah aplikasi web pelaporan kerusakan fasilitas kota/infrastruktur. Pengguna dapat membuat laporan dengan mengisi nama laporan, deskripsi, kategori, lokasi, dan gambar pendukung. Admin dapat melihat daftar laporan, detail laporan, status penanganan, tingkat kerusakan hasil analisis AI, lokasi laporan, serta riwayat perubahan status.

Project ini menggunakan React + Vite untuk Front End, Express.js untuk Back End, MySQL untuk penyimpanan database, OpenCage Geocoding API untuk pencarian lokasi, dan Hugging Face API untuk prediksi tingkat kerusakan laporan.

## Petunjuk Setup Environment

1. Clone repository:

```bash
git clone https://github.com/EllaDwiMaulina/Capstone_Project.git
cd Capstone_Project
```

2. Install dependency:

```bash
npm install
```

Jika menggunakan PowerShell Windows dan `npm` terkena execution policy, gunakan:

```powershell
npm.cmd install
```

3. Buat file `.env` dari contoh environment:

```bash
cp .env.example .env
```

Untuk PowerShell:

```powershell
copy .env.example .env
```

4. Isi konfigurasi `.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:5000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

OPENCAGE_API_KEY=isi_api_key_opencage
HF_AI_API_URL=https://mandalale-citizen-care.hf.space
HF_AI_TIMEOUT_MS=12000

DATABASE_URL=
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_database
DB_NAME=citizencare
```

Catatan:
- Jika `DATABASE_URL` diisi, backend akan memakai URL tersebut untuk koneksi database.
- Jika `DB_HOST`, `DB_USER`, dan `DB_NAME` dikosongkan, backend tetap berjalan memakai data sementara di memory.
- Untuk deploy menggunakan Railway MySQL, isi `DATABASE_URL` dengan value `MYSQL_PUBLIC_URL` dari Railway.
- Backend akan membuat database dan tabel secara otomatis jika kredensial database valid.

5. Struktur tabel yang digunakan:

- `reports`: menyimpan data laporan, lokasi, gambar, status, tingkat kerusakan, dan hasil AI.
- `report_histories`: menyimpan riwayat status laporan.

## Tautan Model ML

Model Machine Learning digunakan melalui Hugging Face Space API berikut:

- Root API: https://mandalale-citizen-care.hf.space/
- Health Check: https://mandalale-citizen-care.hf.space/health
- Predict Endpoint: https://mandalale-citizen-care.hf.space/predict
- Hugging Face Space: https://huggingface.co/spaces/mandalale/citizen_care

Cara memuat/menggunakan model pada aplikasi:

1. Backend membaca URL model dari `.env`:

```env
HF_AI_API_URL=https://mandalale-citizen-care.hf.space
```

2. Saat user mengirim laporan, backend mengirim `deskripsi` laporan ke endpoint:

```txt
POST /predict
```

Payload:

```json
{
  "text": "deskripsi laporan user"
}
```

3. Response model digunakan untuk mengisi field `kerusakan`:

```json
{
  "tingkat_kerusakan": "ringan",
  "severity_score": 18,
  "confidence": 88.85
}
```

Jika API model gagal diakses, backend tetap menyimpan laporan dengan default tingkat kerusakan `Sedang`.

## Cara Menjalankan Aplikasi

### Menjalankan Front End dan Back End Bersamaan

```bash
npm run dev:full
```

Untuk PowerShell:

```powershell
npm.cmd run dev:full
```

Frontend akan berjalan di:

```txt
http://localhost:5173
```

Backend akan berjalan di:

```txt
http://localhost:5000
```

### Menjalankan Back End Saja

```bash
npm run server
```

Untuk PowerShell:

```powershell
npm.cmd run server
```

Tes backend:

```txt
http://localhost:5000/api/health
```

### Menjalankan Front End Saja

```bash
npm run dev
```

Untuk PowerShell:

```powershell
npm.cmd run dev
```

### Build Production

```bash
npm run build
```

Untuk PowerShell:

```powershell
npm.cmd run build
```

### Preview Build Production

```bash
npm run preview
```

Untuk PowerShell:

```powershell
npm.cmd run preview
```

## Endpoint Utama Back End

```txt
GET    /api/health
GET    /api/reports
GET    /api/reports/:id
POST   /api/reports
PUT    /api/reports/:id
PATCH  /api/reports/:id/status
DELETE /api/reports/:id
GET    /api/reports/stats
GET    /api/reports/map
GET    /api/geocode?q=Jakarta
POST   /api/auth/login
```

## Akun Admin Default

```txt
Username: admin
Password: admin123
```

Ubah username dan password admin melalui `.env` sebelum deploy:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password_yang_lebih_aman
```
