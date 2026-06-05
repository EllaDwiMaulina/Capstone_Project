# Data Dictionary
## Dataset Laporan Infrastruktur DKI Jakarta 2025

---

### Informasi Umum

| Atribut | Detail |
|---|---|
| **Nama File** | `Data_Laporan_Infrastruktur_Clean_Fix.csv` |
| **Jumlah Baris** | 14.000 |
| **Jumlah Kolom** | 6 |

---

## 1. Ringkasan Statistik Kolom

| No | Nama Kolom | Tipe Data | Jumlah Baris | Nilai Null | Nilai Unik |
|:--:|---|:--:|:--:|:--:|:--:|
| 1 | `deskripsi_laporan` | `object` | 14.000 | 0 | 7.757 |
| 2 | `jenis_infrastruktur` | `object` | 14.000 | 0 | 7 |
| 3 | `kota_administrasi` | `object`  | 14.000 | 0 | 6 |
| 4 | `tingkat_kerusakan` | `object`  | 14.000 | 0 | 3 |
| 5 | `date_laporan` | `datetime` | 14.000 | 0 | 13.998 |
| 6 | `tingkat_kerusakan_encoded` | `int64` | 14.000 | 0 | 3 |

---

## 2. Kamus Data Lengkap

| No | Nama Kolom | Tipe Data | Deskripsi |
|:--:|---|:--:|---|
| 1 | `deskripsi_laporan` | Object | Teks bebas yang mendeskripsikan kondisi kerusakan infrastruktur yang dilaporkan oleh warga. |
| 2 | `jenis_infrastruktur` | Object | Jenis infrastruktur publik yang mengalami kerusakan dan dilaporkan. |
| 3 | `kota_administrasi` | Object | Wilayah administrasi kota tempat kerusakan infrastruktur dilaporkan. |
| 4 | `tingkat_kerusakan` | Object | Tingkat keparahan kerusakan infrastruktur berdasarkan penilaian laporan. |
| 5 | `date_laporan` | Datetime | Tanggal dan waktu saat laporan kerusakan infrastruktur dikirimkan. |
| 6 | `tingkat_kerusakan_encoded` | Integer | Representasi numerik dari kolom tingkat_kerusakan, digunakan untuk pemodelan machine learning. |

---

## 3. Detail Nilai Kategorikal

### 3.1 `jenis_infrastruktur`

| Nilai | Keterangan |
|---|---|
| `jalan` | Kerusakan permukaan atau badan jalan raya |
| `trotoar` | Kerusakan jalur pejalan kaki / trotoar |
| `lampu jalan` | Kerusakan atau matinya lampu penerangan jalan |
| `kabel fiber` | Kabel serat optik yang menggantung atau rusak |
| `taman` | Kerusakan fasilitas atau area taman publik |
| `drainase` | Kerusakan saluran air / drainase |
| `jembatan` | Kerusakan struktur jembatan |

### 3.2 `kota_administrasi`

| Nilai | Keterangan |
|---|---|
| `jakarta barat` | Kota Administrasi Jakarta Barat |
| `jakarta pusat` | Kota Administrasi Jakarta Pusat |
| `jakarta selatan` | Kota Administrasi Jakarta Selatan |
| `jakarta timur` | Kota Administrasi Jakarta Timur |
| `jakarta utara` | Kota Administrasi Jakarta Utara |
| `kepulauan seribu` | Kabupaten Administrasi Kepulauan Seribu |

### 3.3 `tingkat_kerusakan` & `tingkat_kerusakan_encoded`

| Nilai | Encoded | Keterangan |
|---|:--:|---|
| `ringan` | `0` | Kerusakan minor, tidak mengganggu fungsi utama infrastruktur |
| `sedang` | `1` | Kerusakan cukup signifikan, mulai mengganggu fungsi infrastruktur |
| `berat` | `2` | Kerusakan parah, infrastruktur tidak dapat berfungsi normal |