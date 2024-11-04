// src/controllers/profile/allOrder.js
import Order from '../../models/Order.js';

export const getUserOrders = async (req, res) => {
    try {
        // Ensure req.userId is defined
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        // Fetch orders for the current user and populate product details
        const orders = await Order.find({ userId: req.userId }).populate({
            path: 'items.product',
            model: 'Product', // Ensure this matches your Product model name
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
