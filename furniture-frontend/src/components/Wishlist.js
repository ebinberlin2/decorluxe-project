import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WishlistPage.css'; // Importing the CSS

// Hardcoded base URL
const BASE_URL = 'http://localhost:5000';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlistItems(response.data); // This will be an empty array if there are no items
      setError(null); // Reset error if the request is successful
    } catch (error) {
      setError('Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/${wishlistItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Item removed from wishlist.', { position: 'top-center', autoClose: 3000 });
      fetchWishlist(); // Refresh the wishlist after removing an item
    } catch (error) {
      toast.error('Error removing item from wishlist.', { position: 'top-center', autoClose: 3000 });
    }
  };

  if (loading) return <div className="wishlist-loading">Loading...</div>;
  if (error) return <div className="wishlist-error">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="wishlist-component">
        <h2 className="wishlist-title">My Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p className="wishlist-empty-msg">Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-card" key={item._id}>
                <img
                  src={item.product.imageUrls[0] || 'https://via.placeholder.com/400x300.png?text=Product+Image'}
                  className="wishlist-image"
                  alt={item.product.name}
                />
                <div className="wishlist-body">
                  <h5 className="wishlist-item-name">{item.product.name}</h5>
                  <p className="wishlist-price">₹ {item.product.price}</p>
                  <div className="wishlist-btn-group">
                    <button className="wishlist-move-btn">Move to Bag</button>
                    <button className="wishlist-remove-btn" onClick={() => removeFromWishlist(item._id)}>
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

export default Wishlist;
