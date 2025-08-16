import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrder } from '../controllers/orderController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Cliente
router.post('/', auth, authorize('cliente', 'admin'), createOrder);
router.get('/me', auth, authorize('cliente', 'admin'), getMyOrders);

// Admin
router.get('/', auth, authorize('admin'), getAllOrders);
router.put('/:id', auth, authorize('admin'), updateOrderStatus);

export default router;