import React, { useState } from 'react';
import './StockManagement.css';

const StockManagement = () => {
  const [activeView, setActiveView] = useState('add');
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    stockQuantity: 0,
    imageUrls: [],
    newImageUrl: '',
  });
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'view') {
      fetchProducts();
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Product name is required';
      case 'category':
        return value ? '' : 'Please select a category';
      case 'subcategory':
        return value ? '' : 'Please select a subcategory';
      case 'price':
        return value > 0 ? '' : 'Price must be a positive number';
      case 'stockQuantity':
        return value >= 0 ? '' : 'Stock quantity cannot be negative';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });

    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleNewImageUrlChange = (e) => {
    setProductData({
      ...productData,
      newImageUrl: e.target.value,
    });
  };

  const handleAddImageUrl = () => {
    const { newImageUrl } = productData;
    if (newImageUrl && /^https?:\/\/.+/i.test(newImageUrl)) {
      setProductData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, newImageUrl],
        newImageUrl: '',
      }));
    } else {
      alert('Please enter a valid image URL');
    }
  };

  const handleRemoveImageUrl = (url) => {
    setProductData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((imgUrl) => imgUrl !== url),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(productData).forEach((key) => {
      const errorMessage = validateField(key, productData[key]);
      if (errorMessage) newErrors[key] = errorMessage;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully');
        setProductData({
          name: '',
          description: '',
          category: '',
          subcategory: '',
          price: 0,
          stockQuantity: 0,
          imageUrls: [],
          newImageUrl: '',
        });
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/view');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching products:', errorData.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete product: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product. Please try again later.');
      }
    }
  };

  return (
    <div className="stock-management-page">
      <header className="page-header">
        <h1>Stock Management</h1>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <ul>
            <li onClick={() => handleViewChange('add')} className={activeView === 'add' ? 'active' : ''}>
              Add New Product
            </li>
            <li onClick={() => handleViewChange('view')} className={activeView === 'view' ? 'active' : ''}>
              View & Manage Products
            </li>
          </ul>
        </div>

        <div className="content">
          {activeView === 'add' && (
            <form className="stock-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Product Description"
                  value={productData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="office">Office</option>
                  <option value="outdoor">Outdoor</option>
                </select>
                {errors.category && <p className="error">{errors.category}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="subcategory">Subcategory:</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={productData.subcategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {productData.category === 'living-room' && (
                    <>
                      <option value="sofa">Sofa</option>
                      <option value="coffee-table">Coffee Table</option>
                      <option value="tv-stand">TV Stand</option>
                    </>
                  )}
                  {productData.category === 'bedroom' && (
                    <>
                      <option value="bed">Bed</option>
                      <option value="wardrobe">Wardrobe</option>
                      <option value="nightstand">Nightstand</option>
                    </>
                  )}
                  {productData.category === 'kitchen' && (
                    <>
                      <option value="dining-table">Dining Table</option>
                      <option value="chairs">Chairs</option>
                      <option value="kitchen-island">Kitchen Island</option>
                    </>
                  )}
                  {productData.category === 'office' && (
                    <>
                      <option value="desk">Desk</option>
                      <option value="office-chair">Office Chair</option>
                      <option value="bookshelf">Bookshelf</option>
                    </>
                  )}
                  {productData.category === 'outdoor' && (
                    <>
                      <option value="outdoor-sofa">Outdoor Sofa</option>
                      <option value="patio-set">Patio Set</option>
                      <option value="garden-bench">Garden Bench</option>
                    </>
                  )}
                </select>
                {errors.subcategory && <p className="error">{errors.subcategory}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                />
                {errors.price && <p className="error">{errors.price}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity:</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  placeholder="Stock Quantity"
                  value={productData.stockQuantity}
                  onChange={handleInputChange}
                  required
                />
                {errors.stockQuantity && <p className="error">{errors.stockQuantity}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="imageUrls">Image URLs:</label>
                <div className="image-url-input">
                  <input
                    type="text"
                    value={productData.newImageUrl}
                    onChange={handleNewImageUrlChange}
                    placeholder="Add image URL"
                  />
                  <button type="button" onClick={handleAddImageUrl}>
                    Add Image
                  </button>
                </div>
                <ul className="image-url-list">
                  {productData.imageUrls.map((url, index) => (
                    <li key={index}>
                      <img src={url} alt={`Product Preview ${index + 1}`} className="preview-image" />
                      <button type="button" onClick={() => handleRemoveImageUrl(url)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="submit">Add Product</button>
            </form>
          )}

          {activeView === 'view' && (
            <div className="product-list">
              <h2>Products List</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Images</th> {/* New column for images */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.category}</td>
                        <td>{product.subcategory}</td>
                        <td>${product.price}</td>
                        <td>{product.stockQuantity}</td>
                        <td>
                          {product.imageUrls.length > 0 ? (
                            product.imageUrls.map((url, index) => (
                              <img key={index} src={url} alt={`Product Image ${index + 1}`} className="product-image" />
                            ))
                          ) : (
                            <p>No Images</p>
                          )}
                        </td>
                        <td>
                          <button className="delete-button" onClick={() => handleDelete(product._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No products available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
