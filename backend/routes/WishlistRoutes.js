// wishlistRoutes.js
import express from 'express';
import { addToWishlist, getWishlist } from '../controllers/WishlistController.js';
import verifyToken from '../middleware/authenticateToken.js'; // Import your token verification middleware

const router = express.Router();

// Add product to wishlist
router.post('/', verifyToken, addToWishlist);

// Get user's wishlist
router.get('/', verifyToken, getWishlist);

export default router;
