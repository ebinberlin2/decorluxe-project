import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Fetch wishlist items for the logged-in user
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/wishlist', config);
      setWishlistItems(response.data);
    } catch (error) {
      // Check if the error response exists and handle accordingly
      if (error.response && error.response.data) {
        setError('Error fetching wishlist items: ' + JSON.stringify(error.response.data)); // Stringify the error response data
      } else {
        setError('Error fetching wishlist items: ' + error.message); // Handle generic error
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token'); // Ensure this matches your stored token key
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/wishlist/delete/${productId}`, config);
      // Update the state to remove the product after successful deletion
      setWishlistItems((prevItems) => prevItems.filter(item => item._id !== productId));
      alert('Product removed from wishlist');
    } catch (error) {
      alert('Error removing product from wishlist: ' + (error.response ? error.response.data : error.message));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="wishlist-page">
      <h1 className="page-title">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div key={product._id} className="wishlist-card">
              <img 
                src={product.imageUrl || '/path/to/placeholder-image.jpg'} 
                alt={product.name} 
                className="wishlist-image" 
              />
              <div className="wishlist-info">
                <h4>{product.name}</h4>
                <p className="price">${product.price.toFixed(2)}</p> {/* Format price to two decimal places */}
                <p className="description">{product.description}</p>
              </div>
              <div className="wishlist-actions">
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <FaTrashAlt /> Remove
                </button>
                <button className="cart-btn">
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
