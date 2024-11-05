import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Cart.css'; // Import the new design

// Hardcoded base URL
const BASE_URL = 'http://localhost:5000'; // Change this to your actual base URL

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.get(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      setError('Error fetching cart items.');
      toast.error('Error fetching cart items.', { position: 'top-center', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const token = localStorage.getItem('authToken');

    try {
      await axios.delete(`${BASE_URL}/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
      toast.success('Item removed from cart.', { position: 'top-center', autoClose: 3000 });
    } catch (error) {
      toast.error('Error removing item from cart.', { position: 'top-center', autoClose: 3000 });
    }
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">Your cart is empty.</div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img
                    src={item.product.imageUrls || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h5 className="cart-item-name">{item.product.name}</h5>
                    <p className="cart-item-price">Price: ₹{item.product.price}</p>
                    <div className="cart-item-quantity">
                      {/* Uncomment if you want to show quantity
                      <input type="number" value={item.quantity} className="cart-quantity-input" readOnly />
                      <span>Total: ₹{item.product.price * item.quantity}</span> */}
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemoveFromCart(item._id)}>
                    <FaTrash /> Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h5>Order Summary</h5>
              <div className="summary-detail">
                <span>Total Items</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="summary-detail">
                <span>Total Cost</span>
                <span>₹{totalCost}</span>
              </div>
              <div className="summary-total">
                <span>Grand Total</span>
                <span>₹{totalCost}</span>
              </div>
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
