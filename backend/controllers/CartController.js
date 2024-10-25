import Cart from '../models/Cart.js';
import Product from '../models/ProductReviewModel.js';

// Add or update product in the cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
  }

  try {
    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Find the user's cart or create a new one if none exists
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // If cart exists, check if the item is already in the cart
      const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist in cart
        cart.items.push({ product: productId, quantity });
      }
    } else {
      // Create a new cart for the user if none exists
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    // Save the updated or new cart
    await cart.save();
    return res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get all cart items for the authenticated user
export const getCartItems = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }
    return res.status(200).json(cart.items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Find the index of the item to remove
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === cartItemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
