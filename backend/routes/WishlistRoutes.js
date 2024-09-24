// routes/wishlist.js
import express from 'express';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../controllers/WishlistController.js';
import authenticateToken from '../middleware/authenticateToken.js'; // Middleware to protect routes

const router = express.Router();

// GET request to fetch wishlist items
router.get('/', authenticateToken, fetchWishlist);

// POST request to add a product to the wishlist
router.post('/add', authenticateToken, addToWishlist);

// DELETE request to remove a product from the wishlist
router.delete('/delete/:productId', authenticateToken, removeFromWishlist);

export default router;
