import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaCartPlus, FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductDetails.css'; // Custom CSS for styling
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(''); // Main selected image

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProduct(data);
      setSelectedImage(data.imageUrls[0]); // Set the first image as the main one
    } catch (error) {
      setError('Error fetching product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem('authToken');
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
    const token = localStorage.getItem('authToken');
    if (!productId || !token) {
      toast.error('Product ID or auth token is missing.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity },
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
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="container mt-5 mb-5">
        <div className="row shadow-lg rounded overflow-hidden bg-light product-details-card">
          {/* Left Column: Product Image Grid */}
          <div className="col-md-6 p-4 product-image-section">
            <div className="row mb-3">
              {/* Main Image */}
              <div className="col-12 mb-3 text-center">
                <img
                  src={selectedImage}
                  className="img-fluid main-product-image"
                  alt="Main product"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="col-12 d-flex flex-wrap justify-content-center">
                {product.imageUrls && product.imageUrls.map((imageUrl, index) => (
                  <div className="image-thumbnail" key={index} onClick={() => handleImageClick(imageUrl)}>
                    <img
                      src={imageUrl}
                      className={`img-fluid ${selectedImage === imageUrl ? 'selected' : ''}`}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="col-md-6 p-4 product-info-section">
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
            {/* <div className="quantity-controls d-flex align-items-center mb-4">
              <button className="btn btn-outline-secondary" onClick={handleDecreaseQuantity}>-</button>
              <span className="mx-3 h5">{quantity}</span>
              <button className="btn btn-outline-secondary" onClick={handleIncreaseQuantity}>+</button>
            </div> */}

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

            {/* Full Description */}
            <h5 className="mt-4">Product Description</h5>
            <p>{product.fullDescription || 'No additional description available.'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
