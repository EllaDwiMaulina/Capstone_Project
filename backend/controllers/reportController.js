import {
  createReport,
  deleteReport,
  findReportById,
  findReports,
  getReportStats,
  serializeReport,
  updateReport,
  updateReportStatus,
} from '../repositories/reportRepository.js';
import { geocodeAddressOrFallback } from '../services/geocodingService.js';

function buildPayload(req) {
  return {
    ...req.body,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
  };
}

export async function getReports(req, res, next) {
  try {
    const result = await findReports(req.query);
    res.json({
      data: result.data.map((report) => serializeReport(req, report)),
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReport(req, res, next) {
  try {
    const report = await findReportById(Number(req.params.id));

    if (!report) {
      res.status(404).json({ message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({ data: serializeReport(req, report) });
  } catch (error) {
    next(error);
  }
}

export async function storeReport(req, res, next) {
  try {
    const report = await createReport(buildPayload(req));
    res.status(201).json({
      message: 'Laporan berhasil dikirim.',
      data: serializeReport(req, report),
    });
  } catch (error) {
    next(error);
  }
}

export async function editReport(req, res, next) {
  try {
    const report = await updateReport(Number(req.params.id), buildPayload(req));

    if (!report) {
      res.status(404).json({ message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({
      message: 'Laporan berhasil diperbarui.',
      data: serializeReport(req, report),
    });
  } catch (error) {
    next(error);
  }
}

export async function editReportStatus(req, res, next) {
  try {
    const report = await updateReportStatus(Number(req.params.id), req.body.status);

    if (!report) {
      res.status(404).json({ message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({
      message: 'Status laporan berhasil diperbarui.',
      data: serializeReport(req, report),
    });
  } catch (error) {
    next(error);
  }
}

export async function removeReport(req, res, next) {
  try {
    const deleted = await deleteReport(Number(req.params.id));

    if (!deleted) {
      res.status(404).json({ message: 'Laporan tidak ditemukan.' });
      return;
    }

    res.json({ message: 'Laporan berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
}

export async function getStats(_req, res, next) {
  try {
    res.json({ data: await getReportStats() });
  } catch (error) {
    next(error);
  }
}

export async function getMapReports(req, res, next) {
  try {
    const result = await findReports({ ...req.query, limit: 100 });
    const reports = result.data
      .filter((report) => report.latitude && report.longitude)
      .map((report) => serializeReport(req, report));

    res.json({ data: reports });
  } catch (error) {
    next(error);
  }
}

export async function geocodeLocation(req, res, next) {
  try {
    const query = req.query.q || req.body?.q;

    if (!query) {
      res.status(400).json({ message: 'Parameter lokasi q wajib diisi.' });
      return;
    }

    const data = await geocodeAddressOrFallback(query);

    if (!data) {
      res.status(404).json({
        message: 'Lokasi tidak ditemukan. Pastikan OPENCAGE_API_KEY sudah diisi di file .env lalu restart server.',
      });
      return;
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
}
