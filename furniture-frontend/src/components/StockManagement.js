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
    imageUrl: '',
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
        return value > 0 ? '' : 'Stock quantity cannot be negative and zero';
      case 'imageUrl':
        return value && !/^https?:\/\/.+/i.test(value) ? 'Invalid URL format' : '';
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

    // Validate field on input change
    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
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
          imageUrl: '',
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
                  placeholder="Description"
                  value={productData.description}
                  onChange={handleInputChange}
                ></textarea>
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
                  <option value="dining">Dining Room</option>
                  <option value="living_room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="office">Office</option>
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
                  {productData.category === 'dining' && (
                    <>
                      <option value="dining_table">Dining Table</option>
                      <option value="chair">Chair</option>
                    </>
                  )}
                  {productData.category === 'living_room' && (
                    <>
                      <option value="sofa">Sofa</option>
                      <option value="coffee_table">Coffee Table</option>
                    </>
                  )}
                  {productData.category === 'bedroom' && (
                    <>
                      <option value="bed">Bed</option>
                      <option value="wardrobe">Wardrobe</option>
                    </>
                  )}
                  {productData.category === 'outdoor' && (
                    <>
                      <option value="patio_chairs">Patio Chairs</option>
                      <option value="garden_table">Garden Table</option>
                    </>
                  )}
                  {productData.category === 'office' && (
                    <>
                      <option value="desk">Desk</option>
                      <option value="office_chair">Office Chair</option>
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
                  min="0.01"
                  step="0.01"
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
                  min="0"
                />
                {errors.stockQuantity && <p className="error">{errors.stockQuantity}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Image URL"
                  value={productData.imageUrl}
                  onChange={handleInputChange}
                />
                {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}
              </div>

              <button type="submit">Add Product</button>
            </form>
          )}

          {activeView === 'view' && (
            <div className="product-list">
              <h2>Products</h2>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>{product.subcategory}</td>
                      <td>Rs. {product.price.toFixed(2)}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <button onClick={() => handleDelete(product._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
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
