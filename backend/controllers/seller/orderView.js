import Order from '../../models/Order.js'; 
import Product from '../../models/ProductReviewModel.js'; // Make sure this points to the correct model

// Function to retrieve orders for a seller
export const getOrdersForSeller = async (req, res) => {
    try {
      const sellerId = req.userId; // Assuming userId is set by auth middleware
      const orders = await Order.find({ 'items.product.seller': sellerId }); // Adjust based on your data structure
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this seller.' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
  };
  