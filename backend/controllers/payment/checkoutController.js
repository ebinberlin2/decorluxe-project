import Order from '../../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

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
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 100;

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

    const savedOrder = await newOrder.save();

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: savedOrder._id.toString(),
    });

    // Save Razorpay Order ID in the Order document
    savedOrder.razorpayOrderId = razorpayOrder.id; // Assign the Razorpay Order ID
    await savedOrder.save(); // Ensure to save the updated order

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
  const { orderId, paymentId, razorpaySignature } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    console.log('Razorpay Order ID:', order.razorpayOrderId); // Log the order's Razorpay ID

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${paymentId}`)
      .digest('hex');

    console.log('Generated Signature:', generatedSignature);

    if (generatedSignature !== razorpaySignature) {
      console.error('Signatures do not match.');
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    order.paymentStatus = 'paid';
    order.paymentId = paymentId;
    await order.save();

    res.status(200).json({ message: 'Payment verified successfully.', order });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment.', error: error.message });
  }
};
