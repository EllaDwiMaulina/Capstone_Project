import 'dotenv/config';
import mysql from 'mysql2/promise';

function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

  if (databaseUrl) {
    const parsedUrl = new URL(databaseUrl);

    return {
      host: parsedUrl.hostname,
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace('/', ''),
      port: Number(parsedUrl.port) || 3306,
    };
  }

  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  };
}

const dbConfig = getDatabaseConfig();

let pool = null;

export function getPool() {
  return pool;
}

async function columnExists(tableName, columnName) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbConfig.database, tableName, columnName],
  );

  return rows[0].total > 0;
}

async function addColumnIfMissing(tableName, columnName, definition) {
  if (await columnExists(tableName, columnName)) {
    return;
  }

  await pool.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
}

export async function initializeDatabase() {
  const shouldUseDatabase = Boolean(dbConfig.host && dbConfig.user && dbConfig.database);

  if (!shouldUseDatabase) {
    console.log('Database belum dikonfigurasi. Server memakai data sementara di memori.');
    return;
  }

  const setupConnection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
  });

  await setupConnection.execute(
    `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(dbConfig.database)}
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await setupConnection.end();

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
      ai_source VARCHAR(50) NOT NULL DEFAULT 'default',
      ai_severity_score INT NULL,
      ai_confidence DECIMAL(5, 2) NULL,
      ai_probabilities TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await addColumnIfMissing('reports', 'ai_source', "VARCHAR(50) NOT NULL DEFAULT 'default'");
  await addColumnIfMissing('reports', 'ai_severity_score', 'INT NULL');
  await addColumnIfMissing('reports', 'ai_confidence', 'DECIMAL(5, 2) NULL');
  await addColumnIfMissing('reports', 'ai_probabilities', 'TEXT NULL');

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS report_histories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      note TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_report_histories_report
        FOREIGN KEY (report_id) REFERENCES reports(id)
        ON DELETE CASCADE
    )
  `);

  console.log('Database MySQL terhubung. Tabel reports dan report_histories siap.');
}
