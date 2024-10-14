// Wishlist.js
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('authToken');
    console.log("Fetching wishlist with token:", token); // Check token value
  
    try {
      const response = await axios.get('http://localhost:5000/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Wishlist response:", response.data); // Log response data
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error); // Log error
      setError('Error fetching wishlist: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };
  const removeFromWishlist = async (wishlistItemId) => {
    const token = localStorage.getItem('authToken');

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${wishlistItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Item removed from wishlist.', { position: 'top-center', autoClose: 3000 });
      // Refresh the wishlist after removing an item
      fetchWishlist();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred. Please try again.';
      toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="container mt-5 mb-5">
        <h2>Your Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p className="text-center">Your wishlist is empty.</p>
        ) : (
          <div className="row">
            {wishlistItems.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card mb-4 shadow-sm">
                  <img
                    src={item.product.imageUrl || 'https://via.placeholder.com/400x300.png?text=Product+Image'}
                    className="card-img-top"
                    alt={item.product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">Price: ₹ {item.product.price}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <FaTrash className="mr-2" /> Remove
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

export default Wishlist;
