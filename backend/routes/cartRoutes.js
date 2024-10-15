// routes/cartRoutes.js
import express from 'express';
import { addToCart, getCartItems, removeFromCart } from '../controllers/CartController.js';
import  verifyToken  from '../middleware/authenticateToken.js'; // Middleware for token verification

const router = express.Router();

// Route to add a product to the cart
router.post('/', verifyToken, addToCart);

// Route to get all cart items for the authenticated user
router.get('/', verifyToken, getCartItems);

// Route to remove an item from the cart
router.delete('/:cartItemId', verifyToken, removeFromCart);

export default router;
