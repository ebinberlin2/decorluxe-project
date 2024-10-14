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
    if (!productId) {
      console.error('Product ID is required.');
      toast.error('Product ID is required.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    const token = localStorage.getItem('authToken'); // Get the token from local storage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/wishlist',
        { productId }, // Ensure productId is being sent
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message, { position: 'top-center', autoClose: 3000 });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.status === 400
            ? error.response.data.message
            : 'An error occurred. Please try again.';
        toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
      }
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
              <span className="ml-2">
                ({product.numReviews || 0} Ratings)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mb-4">
              <button className="btn btn-danger btn-lg mr-2">
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
