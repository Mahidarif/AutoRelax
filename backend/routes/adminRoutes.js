import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats, getInventory, getReports } from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/reports', getReports);

export default router;
