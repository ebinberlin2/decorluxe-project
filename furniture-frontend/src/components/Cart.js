import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css'; // Custom CSS for Cart

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('authToken'); // Fetch token from local storage
    if (!token) {
      toast.error('Authentication token is missing.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cartItems);
    } catch (error) {
      setError('Error fetching cart: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('authToken');

    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.product._id !== productId));
      toast.success('Item removed from cart', { position: 'top-center', autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to remove item', { position: 'top-center', autoClose: 3000 });
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    const token = localStorage.getItem('authToken');
    try {
      const item = cartItems.find((item) => item.product._id === productId);
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: item.quantity + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(
        cartItems.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      toast.error('Failed to update quantity', { position: 'top-center', autoClose: 3000 });
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const token = localStorage.getItem('authToken');
    const item = cartItems.find((item) => item.product._id === productId);

    if (item.quantity <= 1) return; // Do not allow decreasing below 1

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: item.quantity - 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(
        cartItems.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } catch (error) {
      toast.error('Failed to update quantity', { position: 'top-center', autoClose: 3000 });
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart">
          {cartItems.map((item) => (
            <div className="cart-item shadow-sm p-3 mb-4 bg-white rounded" key={item.product._id}>
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={item.product.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-9">
                  <h4>{item.product.name}</h4>
                  <p>Price: ₹ {item.product.price}</p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary mr-2"
                      onClick={() => handleDecreaseQuantity(item.product._id)}
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary mr-2"
                      onClick={() => handleIncreaseQuantity(item.product._id)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="btn btn-outline-danger ml-auto"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                  <p className="mt-3">Subtotal: ₹ {item.product.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-total shadow-sm p-3 bg-white rounded">
            <h4>Total Price: ₹ {calculateTotalPrice()}</h4>
            <button className="btn btn-primary btn-lg">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
