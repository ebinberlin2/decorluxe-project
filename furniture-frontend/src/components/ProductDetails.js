import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaCartPlus, FaHeart, FaPencilAlt } from 'react-icons/fa';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-details-container">
      <div className="product-image">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x300.png?text=Product+Image'}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">₹ {product.price}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          <span>{product.rating || 0} <FaStar /></span>
        </div>

        {/* Button Container */}
        <div className="button-container">
          <button className="add-to-cart-btn">
            <FaCartPlus /> Add to Cart
          </button>
          <button className="buy-now-btn">Buy Now</button>
          <button className="wishlist-btn">
            <FaHeart /> Add to Wishlist
          </button>
          <button className="review-btn">
            <FaPencilAlt /> Write a Review
          </button>
        </div>

        {/* Additional Sections */}
        {/* <div className="additional-info">
          <h2>Product Details</h2>
          <p>{product.details || 'No additional details available.'}</p>
          
          <h2>Measurements</h2>
          <p>{product.measurements || 'N/A'}</p>

          <h2>Designer Thoughts</h2>
          <p>{product.designerThoughts || 'No designer thoughts available.'}</p>

          <h2>Customer Reviews</h2>
          <div className="reviews">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="review">
                  <p><strong>{review.user}</strong>: {review.comment}</p>
                  <p>Rating: {review.rating} <FaStar /></p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetails;
