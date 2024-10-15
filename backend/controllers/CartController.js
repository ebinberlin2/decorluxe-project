// controllers/CartController.js
import Cart from '../models/Cart.js';
import Product from '../models/ProductReviewModel.js'; // Assuming you have a Product model

// Add or update product in the cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assume the user is already authenticated and `req.user` contains the user's ID

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
  }

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if the item is already in the cart
    const cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      // If item is already in the cart, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully.', cartItem });
    } else {
      // If item is not in the cart, create a new cart item
      const newCartItem = new Cart({
        user: userId,
        product: productId,
        quantity,
      });
      await newCartItem.save();
      return res.status(201).json({ message: 'Added to cart successfully.', cartItem: newCartItem });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get all cart items for the authenticated user
export const getCartItems = async (req, res) => {
  const userId = req.user.id; // Assume the user is already authenticated

  try {
    const cartItems = await Cart.find({ user: userId }).populate('product');
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    return res.status(200).json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
