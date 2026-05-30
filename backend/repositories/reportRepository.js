import { getPool } from '../config/database.js';
import { seedReports } from '../data/seedReports.js';
import { getPriorityFromDamageLevel, predictDamageLevel } from '../services/aiPredictionService.js';
import { geocodeAddressOrFallback } from '../services/geocodingService.js';

const memoryReports = [...seedReports];
const memoryHistories = memoryReports.map((report) => ({
  id: report.id,
  reportId: report.id,
  status: report.status,
  note: 'Laporan dibuat.',
  createdAt: report.createdAt,
}));

const allowedStatuses = ['baru', 'pending', 'diproses', 'selesai'];
const allowedDamageLevels = ['Ringan', 'Sedang', 'Berat'];

function getReportImage(req, imageUrl) {
  if (!imageUrl || imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${req.protocol}://${req.get('host')}${imageUrl}`;
}

export function serializeReport(req, report) {
  return {
    ...report,
    imageUrl: getReportImage(req, report.imageUrl),
    image: getReportImage(req, report.imageUrl),
    tanggal: new Date(report.createdAt).toISOString().slice(0, 10),
    waktu: new Date(report.createdAt).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }),
  };
}

function mapDbReport(row) {
  let probabilities = null;

  try {
    probabilities = row.ai_probabilities ? JSON.parse(row.ai_probabilities) : null;
  } catch {
    probabilities = null;
  }

  return {
    id: row.id,
    judul: row.judul,
    deskripsi: row.deskripsi,
    kategori: row.kategori,
    lokasi: row.lokasi,
    status: row.status,
    kerusakan: row.kerusakan,
    prioritas: row.prioritas,
    pelapor: row.pelapor,
    imageUrl: row.image_url,
    latitude: row.latitude,
    longitude: row.longitude,
    aiAnalysis: {
      source: row.ai_source,
      severityScore: row.ai_severity_score,
      confidence: row.ai_confidence,
      probabilities,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDbHistory(row) {
  return {
    id: row.id,
    reportId: row.report_id,
    status: row.status,
    note: row.note,
    createdAt: row.created_at,
  };
}

function normalizeReportPayload(payload) {
  const kerusakan = allowedDamageLevels.includes(payload.kerusakan) ? payload.kerusakan : 'Sedang';

  return {
    judul: payload.judul?.trim(),
    deskripsi: payload.deskripsi?.trim(),
    kategori: payload.kategori?.trim(),
    lokasi: payload.lokasi?.trim(),
    status: allowedStatuses.includes(payload.status) ? payload.status : 'baru',
    kerusakan,
    prioritas: payload.prioritas || getPriorityFromDamageLevel(kerusakan),
    pelapor: payload.pelapor?.trim() || 'Masyarakat Umum',
    imageUrl: payload.imageUrl || null,
    latitude: payload.latitude || null,
    longitude: payload.longitude || null,
    aiAnalysis: payload.aiAnalysis || {
      source: 'default',
      severityScore: null,
      confidence: null,
      probabilities: null,
    },
  };
}

function validateReportPayload(report) {
  if (!report.judul || !report.deskripsi || !report.kategori || !report.lokasi) {
    const error = new Error('Judul, deskripsi, kategori, dan lokasi wajib diisi.');
    error.statusCode = 400;
    throw error;
  }
}

function applyFilters(reports, query) {
  const { status, kategori, q, date } = query;

  return reports.filter((report) => {
    const keyword = q?.toLowerCase();
    const matchesStatus = status ? report.status.toLowerCase() === status.toLowerCase() : true;
    const matchesCategory = kategori ? report.kategori.toLowerCase() === kategori.toLowerCase() : true;
    const matchesDate = date ? report.createdAt.slice(0, 10) === date : true;
    const matchesKeyword = keyword
      ? [report.judul, report.deskripsi, report.kategori, report.lokasi, report.pelapor].some((value) =>
          value?.toLowerCase().includes(keyword),
        )
      : true;

    return matchesStatus && matchesCategory && matchesDate && matchesKeyword;
  });
}

function sortAndPaginate(reports, query) {
  const sort = query.sort === 'terlama' ? 'terlama' : 'terbaru';
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || reports.length || 10, 1), 100);
  const sorted = [...reports].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sort === 'terbaru' ? dateB - dateA : dateA - dateB;
  });
  const total = sorted.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;

  return {
    data: sorted.slice(start, start + limit),
    meta: { page, limit, total, totalPages },
  };
}

export async function findReports(query = {}) {
  const pool = getPool();

  if (pool) {
    const filters = [];
    const values = [];

    if (query.status) {
      filters.push('status = ?');
      values.push(query.status);
    }

    if (query.kategori) {
      filters.push('kategori = ?');
      values.push(query.kategori);
    }

    if (query.date) {
      filters.push('DATE(created_at) = ?');
      values.push(query.date);
    }

    if (query.q) {
      filters.push('(judul LIKE ? OR deskripsi LIKE ? OR kategori LIKE ? OR lokasi LIKE ? OR pelapor LIKE ?)');
      values.push(...Array(5).fill(`%${query.q}%`));
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = query.sort === 'terlama' ? 'ASC' : 'DESC';
    const [rows] = await pool.execute(`SELECT * FROM reports ${whereClause} ORDER BY created_at ${orderBy}`, values);

    return sortAndPaginate(rows.map(mapDbReport), { ...query, sort: query.sort || 'terbaru' });
  }

  return sortAndPaginate(applyFilters(memoryReports, query), query);
}

export async function findReportById(id) {
  const pool = getPool();

  if (pool) {
    const [rows] = await pool.execute('SELECT * FROM reports WHERE id = ? LIMIT 1', [id]);
    if (!rows[0]) {
      return null;
    }

    const report = mapDbReport(rows[0]);
    report.histories = await findReportHistories(id);
    return report;
  }

  const report = memoryReports.find((item) => item.id === id);

  if (!report) {
    return null;
  }

  return {
    ...report,
    histories: memoryHistories.filter((history) => history.reportId === id),
  };
}

export async function createReport(payload) {
  const report = normalizeReportPayload(payload);
  validateReportPayload(report);
  const prediction = await predictDamageLevel(report.deskripsi);

  report.kerusakan = prediction.kerusakan;
  report.prioritas = getPriorityFromDamageLevel(report.kerusakan);
  report.aiAnalysis = {
    source: prediction.source,
    severityScore: prediction.severityScore || null,
    confidence: prediction.confidence || null,
    probabilities: prediction.probabilities || null,
  };

  const coordinates = report.latitude && report.longitude ? null : await geocodeAddressOrFallback(report.lokasi);

  if (coordinates) {
    report.latitude = report.latitude || coordinates.latitude;
    report.longitude = report.longitude || coordinates.longitude;
  }

  const pool = getPool();

  if (pool) {
    const [result] = await pool.execute(
      `INSERT INTO reports
        (judul, deskripsi, kategori, lokasi, status, kerusakan, prioritas, pelapor, image_url,
         latitude, longitude, ai_source, ai_severity_score, ai_confidence, ai_probabilities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        report.judul,
        report.deskripsi,
        report.kategori,
        report.lokasi,
        report.status,
        report.kerusakan,
        report.prioritas,
        report.pelapor,
        report.imageUrl,
        report.latitude,
        report.longitude,
        report.aiAnalysis.source,
        report.aiAnalysis.severityScore,
        report.aiAnalysis.confidence,
        report.aiAnalysis.probabilities ? JSON.stringify(report.aiAnalysis.probabilities) : null,
      ],
    );

    await addReportHistory(result.insertId, report.status, 'Laporan dibuat.');
    return findReportById(result.insertId);
  }

  const now = new Date().toISOString();
  const createdReport = {
    id: memoryReports.length ? Math.max(...memoryReports.map((item) => item.id)) + 1 : 1,
    ...report,
    createdAt: now,
    updatedAt: now,
  };

  memoryReports.unshift(createdReport);
  memoryHistories.push({
    id: memoryHistories.length ? Math.max(...memoryHistories.map((item) => item.id)) + 1 : 1,
    reportId: createdReport.id,
    status: createdReport.status,
    note: 'Laporan dibuat.',
    createdAt: now,
  });
  return createdReport;
}

export async function updateReport(id, payload) {
  const existingReport = await findReportById(id);

  if (!existingReport) {
    return null;
  }

  const report = normalizeReportPayload({ ...existingReport, ...payload });
  validateReportPayload(report);
  const shouldRefreshCoordinates = payload.lokasi && payload.lokasi !== existingReport.lokasi;
  const coordinates =
    report.latitude && report.longitude && !shouldRefreshCoordinates ? null : await geocodeAddressOrFallback(report.lokasi);

  if (coordinates) {
    report.latitude = coordinates.latitude;
    report.longitude = coordinates.longitude;
  }

  const pool = getPool();

  if (pool) {
    await pool.execute(
      `UPDATE reports
       SET judul = ?, deskripsi = ?, kategori = ?, lokasi = ?, status = ?, kerusakan = ?,
           prioritas = ?, pelapor = ?, image_url = ?, latitude = ?, longitude = ?,
           ai_source = ?, ai_severity_score = ?, ai_confidence = ?, ai_probabilities = ?
       WHERE id = ?`,
      [
        report.judul,
        report.deskripsi,
        report.kategori,
        report.lokasi,
        report.status,
        report.kerusakan,
        report.prioritas,
        report.pelapor,
        report.imageUrl,
        report.latitude,
        report.longitude,
        report.aiAnalysis?.source || 'default',
        report.aiAnalysis?.severityScore || null,
        report.aiAnalysis?.confidence || null,
        report.aiAnalysis?.probabilities ? JSON.stringify(report.aiAnalysis.probabilities) : null,
        id,
      ],
    );

    return findReportById(id);
  }

  const index = memoryReports.findIndex((item) => item.id === id);
  memoryReports[index] = {
    ...memoryReports[index],
    ...report,
    updatedAt: new Date().toISOString(),
  };

  return memoryReports[index];
}

export async function updateReportStatus(id, status) {
  if (!allowedStatuses.includes(status)) {
    const error = new Error('Status harus salah satu dari: baru, pending, diproses, selesai.');
    error.statusCode = 400;
    throw error;
  }

  const existingReport = await findReportById(id);

  if (!existingReport) {
    return null;
  }

  const updatedReport = await updateReport(id, { status });

  if (updatedReport && existingReport.status !== status) {
    await addReportHistory(id, status, `Status diubah dari ${existingReport.status} menjadi ${status}.`);
  }

  return updatedReport;
}

export async function addReportHistory(reportId, status, note = null) {
  const pool = getPool();

  if (pool) {
    await pool.execute(
      'INSERT INTO report_histories (report_id, status, note) VALUES (?, ?, ?)',
      [reportId, status, note],
    );
    return;
  }

  memoryHistories.push({
    id: memoryHistories.length ? Math.max(...memoryHistories.map((item) => item.id)) + 1 : 1,
    reportId,
    status,
    note,
    createdAt: new Date().toISOString(),
  });
}

export async function findReportHistories(reportId) {
  const pool = getPool();

  if (pool) {
    const [rows] = await pool.execute(
      'SELECT * FROM report_histories WHERE report_id = ? ORDER BY created_at ASC, id ASC',
      [reportId],
    );

    return rows.map(mapDbHistory);
  }

  return memoryHistories.filter((history) => history.reportId === reportId);
}

export async function deleteReport(id) {
  const pool = getPool();

  if (pool) {
    const [result] = await pool.execute('DELETE FROM reports WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  const index = memoryReports.findIndex((report) => report.id === id);

  if (index === -1) {
    return false;
  }

  memoryReports.splice(index, 1);
  return true;
}

export async function getReportStats() {
  const { data } = await findReports({ limit: 100 });
  const byStatus = Object.fromEntries(allowedStatuses.map((status) => [status, 0]));
  const byCategory = {};

  for (const report of data) {
    byStatus[report.status] = (byStatus[report.status] || 0) + 1;
    byCategory[report.kategori] = (byCategory[report.kategori] || 0) + 1;
  }

  return {
    total: data.length,
    byStatus,
    byCategory,
    highPriority: data.filter((report) => report.prioritas === 'High').length,
  };
}
