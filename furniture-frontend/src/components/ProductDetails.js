import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaCartPlus, FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductDetails.css'; // Importing custom CSS
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // New state for quantity

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError('Error fetching product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem('authToken'); // Get the token from local storage
    if (!productId || !token) {
      toast.error('Product ID or auth token is missing.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/wishlist',
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message, { position: 'top-center', autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Item Already in the wishlist', { position: 'top-center', autoClose: 3000 });
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('authToken'); // Get the token from local storage
    if (!productId || !token) {
      toast.error('Product ID or auth token is missing.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity }, // Pass the quantity to the backend
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success('Added to cart successfully!', { position: 'top-center', autoClose: 3000 });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to add to cart';
        toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
      }
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // Increase quantity by 1
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Decrease quantity by 1, but not below 1
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="container mt-5 mb-5">
        <div className="row shadow-lg rounded overflow-hidden bg-light">
          {/* Left Column: Product Image */}
          <div className="col-md-6 p-0">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400x300.png?text=Product+Image'}
              className="img-fluid product-image"
              alt={product.name}
            />
          </div>

          {/* Right Column: Product Info */}
          <div className="col-md-6 p-4">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price text-danger h4">₹ {product.price}</p>
            <p className="product-description">{product.description}</p>

            {/* Rating */}
            <div className="product-rating d-flex align-items-center mb-3">
              <span className="text-warning h5">
                {product.rating || 0} <FaStar />
              </span>
              <span className="ml-2">({product.numReviews || 0} Ratings)</span>
            </div>

            {/* Quantity Controls */}
            <div className="quantity-controls d-flex align-items-center mb-4">
              <button className="btn btn-outline-secondary" onClick={handleDecreaseQuantity}>
                -
              </button>
              <span className="mx-3 h5">{quantity}</span>
              <button className="btn btn-outline-secondary" onClick={handleIncreaseQuantity}>
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mb-4">
              <button className="btn btn-danger btn-lg mr-2" onClick={() => addToCart(product._id)}>
                <FaCartPlus className="mr-2" /> Add to Cart
              </button>
              <button className="btn btn-primary btn-lg">Buy Now</button>
            </div>

            {/* Wishlist */}
            <div className="mb-4">
              <button className="btn btn-outline-secondary" onClick={() => addToWishlist(product._id)}>
                <FaHeart className="mr-2" /> Add to Wishlist
              </button>
            </div>

            {/* Description */}
            <h5 className="mt-4">Product Description</h5>
            <p>{product.fullDescription || 'No additional description available.'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
