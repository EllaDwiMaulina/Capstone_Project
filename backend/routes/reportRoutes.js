import { Router } from 'express';
import {
  editReport,
  editReportStatus,
  geocodeLocation,
  getMapReports,
  getReport,
  getReports,
  getStats,
  removeReport,
  storeReport,
} from '../controllers/reportController.js';
import { uploadReportImage } from '../middleware/upload.js';

const router = Router();

router.get('/', getReports);
router.get('/stats', getStats);
router.get('/map', getMapReports);
router.get('/geocode', geocodeLocation);
router.get('/:id', getReport);
router.post('/', uploadReportImage.single('image'), storeReport);
router.put('/:id', uploadReportImage.single('image'), editReport);
router.patch('/:id/status', editReportStatus);
router.delete('/:id', removeReport);

export default router;
