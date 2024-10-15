// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user model
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Quantity cannot be less than 1
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
