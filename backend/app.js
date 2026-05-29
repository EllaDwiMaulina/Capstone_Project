import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const uploadsDir = path.join(__dirname, '..', 'uploads');
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'API CitizenCare berjalan.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/reports', reportRoutes);
app.use('/api/admin/reports', reportRoutes);
app.get('/api/geocode', (req, res, next) => {
  req.url = `/geocode${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;
  reportRoutes(req, res, next);
});
app.use('/api/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
