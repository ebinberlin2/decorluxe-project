// controllers/wishlistController.js
import Wishlist from '../models/WishlistModel.js';

// Fetch wishlist items for the logged-in user
export const fetchWishlist = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated token
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    return res.status(200).json(wishlist.products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add a product to the wishlist
export const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }
    await wishlist.save();
    return res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    return res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
