// controllers/WishlistController.js
import Wishlist from '../models/wishlist.js';
import jwt from 'jsonwebtoken';

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Assuming user ID is extracted from token

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    // Check if the item is already in the wishlist
    const wishlistItem = await Wishlist.findOne({ user: userId, product: productId });

    if (wishlistItem) {
      return res.status(400).json({ message: 'Product is already in the wishlist.' });
    }

    // Create a new wishlist item
    const newWishlistItem = new Wishlist({
      user: userId,     // Set the user ID
      product: productId // Set the product ID
    });

    await newWishlistItem.save();

    return res.status(201).json({ message: 'Product added to wishlist.' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ message: 'Failed to add to wishlist.' });
  }
};


// Fetch user's wishlist
export const getWishlist = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Safely access the token
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Use user ID from decoded token

    const wishlistItems = await Wishlist.find({ user: userId }).populate('product');
    
    if (!wishlistItems.length) {
      return res.status(404).json({ message: 'No items found in wishlist.' });
    }
    
    return res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error); // Log the error
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};