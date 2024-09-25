import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaCartPlus, FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  if (loading) return <div className="text-center my-5 text-white">Loading...</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <div className="container mt-5 bg-dark text-white p-4 rounded">
      <div className="row">
        {/* Left Column: Product Image */}
        <div className="col-md-6">
          <div className="product-image mb-3">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400x300.png?text=Product+Image'}
              className="img-fluid rounded"
              alt={product.name}
            />
          </div>
          {/* Thumbnails */}
          <div className="d-flex justify-content-between">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/80x80.png?text=Thumb1'}
              className="img-thumbnail"
              alt="Thumbnail 1"
              style={{ width: '80px', height: '80px' }}
            />
            <img
              src={product.imageUrl || 'https://via.placeholder.com/80x80.png?text=Thumb2'}
              className="img-thumbnail"
              alt="Thumbnail 2"
              style={{ width: '80px', height: '80px' }}
            />
            <img
              src={product.imageUrl || 'https://via.placeholder.com/80x80.png?text=Thumb3'}
              className="img-thumbnail"
              alt="Thumbnail 3"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="col-md-6">
          <h1 className="product-title mb-3 text-white">{product.name}</h1>
          <p className="product-price text-danger h4">₹ {product.price}</p>
          <p className="product-description text-white">{product.description}</p>

          {/* Rating */}
          <div className="product-rating d-flex align-items-center mb-3">
            <span className="text-warning h5">
              {product.rating || 0} <FaStar />
            </span>
            <span className="ml-2 text-white">
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
            <button className="btn btn-outline-light">
              <FaHeart className="mr-2" /> Add to Wishlist
            </button>
          </div>

          {/* Description */}
          <h5 className="mb-3 text-white">Product Description</h5>
          <p>{product.fullDescription || 'No additional description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
