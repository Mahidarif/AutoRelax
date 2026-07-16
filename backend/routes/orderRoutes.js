import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(optionalProtect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/pay').put(optionalProtect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(optionalProtect, getOrderById);

export default router;
