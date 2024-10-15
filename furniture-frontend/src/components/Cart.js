// src/components/Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import './Cart.css'; // Import your custom styles if needed

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('authToken'); // Get the token from local storage

    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
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
    const token = localStorage.getItem('authToken'); // Get the token from local storage

    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
      toast.success('Item removed from cart.', { position: 'top-center', autoClose: 3000 });
    } catch (error) {
      toast.error('Error removing item from cart.', { position: 'top-center', autoClose: 3000 });
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="container mt-5 mb-5">
        <h1 className="text-center mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">Your cart is empty.</div>
        ) : (
          <div className="row">
            {cartItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card shadow-sm">
                  <img src={item.product.imageUrl} alt={item.product.name} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">Price: ₹{item.product.price}</p>
                    <p className="card-text">Quantity: {item.quantity}</p>
                    <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item._id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
