import 'dotenv/config';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
};

let pool = null;

export function getPool() {
  return pool;
}

export async function initializeDatabase() {
  const shouldUseDatabase = Boolean(dbConfig.host && dbConfig.user && dbConfig.database);

  if (!shouldUseDatabase) {
    console.log('Database belum dikonfigurasi. Server memakai data sementara di memori.');
    return;
  }

  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(150) NOT NULL,
      deskripsi TEXT NOT NULL,
      kategori VARCHAR(100) NOT NULL,
      lokasi VARCHAR(150) NOT NULL,
      status ENUM('baru', 'pending', 'diproses', 'selesai') NOT NULL DEFAULT 'baru',
      kerusakan ENUM('Ringan', 'Sedang', 'Berat') NOT NULL DEFAULT 'Sedang',
      prioritas ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
      pelapor VARCHAR(100) NOT NULL DEFAULT 'Masyarakat Umum',
      image_url TEXT NULL,
      latitude DECIMAL(10, 8) NULL,
      longitude DECIMAL(11, 8) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('Database MySQL terhubung dan tabel reports siap.');
}
