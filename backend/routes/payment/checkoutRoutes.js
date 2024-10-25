// routes/checkoutRoutes.js
import express from 'express';
import { createOrder, verifyPayment } from '../../controllers/payment/checkoutController.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

// Ensure this matches the endpoint being called
router.post('/create', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;
