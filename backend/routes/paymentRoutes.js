import express from 'express';
import { body } from 'express-validator';
import { initiateJazzCashPayment, handleJazzCashCallback } from '../controllers/paymentController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/jazzcash/initiate',
  optionalProtect,
  [
    body('orderData').notEmpty().withMessage('orderData is required').isObject().withMessage('orderData must be an object'),
  ],
  initiateJazzCashPayment
);

router.post('/jazzcash/callback', handleJazzCashCallback);

export default router;
