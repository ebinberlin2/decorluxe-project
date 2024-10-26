import Order from '../../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Product from '../../models/ProductReviewModel.js';  // Import Product model

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
  const userId = req.userId;
  const { fullName, email, phone, address, city, state, zipCode, country, items } = req.body;

  if (!fullName || !email || !phone || !address || !city || !state || !zipCode || !country || !items || items.length === 0) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Calculate the total amount in rupees (not multiplied by 100)
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // Create a new order in the database
    const newOrder = new Order({
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      items,
      totalAmount, // Save total amount as it is
    });

    const savedOrder = await newOrder.save();

    // Create the Razorpay order with the amount in paise (multiply by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Multiply by 100 only for Razorpay order
      currency: 'INR',
      receipt: savedOrder._id.toString(),
    });

    // Save the Razorpay Order ID in the Order document
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    console.log('Order created and saved with Razorpay Order ID:', savedOrder);

    res.status(201).json({
      message: 'Order created successfully.',
      order: savedOrder,
      razorpayOrderId: razorpayOrder.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order.', error: error.message });
  }
};


// Verify Payment


export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, razorpaySignature } = req.body;

    // Find the order by ID and populate product details
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Check if the order has a valid Razorpay order ID
    if (!order.razorpayOrderId) {
      return res.status(400).json({ message: 'Invalid order data for verification.' });
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed due to invalid signature.' });
    }

    // Mark the order as paid
    order.paymentStatus = 'paid';
    order.paymentId = paymentId;
    await order.save();

    // Update stock quantities in parallel
    const updateStockPromises = order.items.map(async (item) => {
      const product = await Product.findById(item.product._id);
      if (product) {
        if (product.stockQuantity >= item.quantity) {
          product.stockQuantity -= item.quantity;
          await product.save();
        } else {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
      } else {
        throw new Error(`Product not found: ${item.product._id}`);
      }
    });

    // Await all stock updates
    await Promise.all(updateStockPromises);

    res.status(200).json({ message: 'Payment verified and stock updated successfully.', order });
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ message: 'Error verifying payment and updating stock.', error: error.message });
  }
};