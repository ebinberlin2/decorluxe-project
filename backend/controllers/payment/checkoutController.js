import Order from '../../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Product from '../../models/ProductReviewModel.js';  // Make sure this path is correct

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
  const userId = req.userId;
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    items,
  } = req.body;

  // Validate user input
  if (!fullName || !email || !phone || !address || !city || !state || !zipCode || !country || !items || items.length === 0) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Calculate total amount for the order
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 100; // Amount in paise

    // Create a new order
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
      totalAmount,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: savedOrder._id.toString(),
    });

    // Save the Razorpay order ID in the Order document
    savedOrder.razorpayOrderId = razorpayOrder.id; // Assign the Razorpay Order ID
    await savedOrder.save(); // Ensure to save the updated order

    console.log('Order created and saved with Razorpay Order ID:', savedOrder);

    // Respond with success
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

    console.log('Received data:', { orderId, paymentId, razorpaySignature });

    // Find the order by ID
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      console.error('Order not found for ID:', orderId);
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (!order.razorpayOrderId) {
      console.error('Invalid Razorpay Order ID in order data:', order);
      return res.status(400).json({ message: 'Invalid order data for verification.' });
    }

    // Generate a signature to compare
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.error('Payment verification failed. Generated signature mismatch.');
      return res.status(400).json({ message: 'Payment verification failed due to invalid signature.' });
    }

    // Mark the order as paid
    order.paymentStatus = 'paid';
    order.paymentId = paymentId;
    await order.save();

    const updateStockPromises = order.items.map(async (item) => {
      const product = await Product.findById(item.product._id);
      if (product) {
        if (product.stockQuantity >= item.quantity) {
          product.stockQuantity -= item.quantity;
          await product.save({ validateBeforeSave: false }); // Skip validation if not necessary
        } else {
          console.error('Insufficient stock for product:', product.name);
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
      } else {
        console.error('Product not found for ID:', item.product._id);
        throw new Error(`Product not found: ${item.product._id}`);
      }
    });

    await Promise.all(updateStockPromises);

    res.status(200).json({ message: 'Payment verified and stock updated successfully.', order });
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ message: 'Error verifying payment and updating stock.', error: error.message });
  }
};
