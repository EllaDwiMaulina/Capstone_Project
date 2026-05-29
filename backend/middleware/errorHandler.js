export function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.name === 'MulterError') {
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Ukuran gambar maksimal 5MB.' : error.message;
    res.status(400).json({ message });
    return;
  }

  res.status(error.statusCode || 500).json({
    message: error.message || 'Terjadi kesalahan pada server.',
  });
}
