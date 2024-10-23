import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Typography, Snackbar, Alert } from '@mui/material';

const categories = {
  'Living Room Furniture': ['Sofas', 'Armchairs', 'Coffee Tables'],
  'Bedroom Furniture': ['Beds', 'Nightstands', 'Dressers'],
  // Add more categories here...
};

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    stockQuantity: 0,
    imageUrls: [],
    newImageUrl: '',
    status: 'active',
  });
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Handle category change and dynamically set subcategories
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSubcategories(categories[category] || []);
    setProductData({ ...productData, category, subcategory: '' });
  };

  // Handle adding image URL to list
  const handleAddImageUrl = () => {
    const { newImageUrl } = productData;
    if (newImageUrl.trim()) {
      setProductData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, newImageUrl],
        newImageUrl: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!productData.name || !productData.description || !productData.category || !productData.subcategory || productData.price <= 0 || productData.stockQuantity <= 0) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    try {
      // Replace this URL with your backend API endpoint
      const response = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setProductData({
          name: '',
          description: '',
          category: '',
          subcategory: '',
          price: 0,
          stockQuantity: 0,
          imageUrls: [],
          newImageUrl: '',
          status: 'active',
        });
      } else {
        setError(result.message || 'Failed to add product.');
      }
    } catch (error) {
      setError('An error occurred while adding the product.');
    }
  };

  // Handle closing the error or success message
  const handleCloseAlert = () => {
    setError('');
    setSuccess(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Add Product
        </Typography>

        {/* Error message */}
        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Success message */}
        {success && (
          <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success">
              Product added successfully!
            </Alert>
          </Snackbar>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="name"
              name="name"
              label="Product Name"
              fullWidth
              value={productData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                id="category"
                name="category"
                value={productData.category}
                onChange={handleCategoryChange}
                required
              >
                {Object.keys(categories).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                id="subcategory"
                name="subcategory"
                value={productData.subcategory}
                onChange={handleInputChange}
                required
              >
                {subcategories.map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="price"
              name="price"
              label="Price"
              fullWidth
              type="number"
              value={productData.price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="stockQuantity"
              name="stockQuantity"
              label="Stock Quantity"
              fullWidth
              type="number"
              value={productData.stockQuantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="description"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={productData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              id="newImageUrl"
              name="newImageUrl"
              label="Image URL"
              fullWidth
              value={productData.newImageUrl}
              onChange={handleInputChange}
            />
            <Button onClick={handleAddImageUrl} variant="contained" color="primary" style={{ marginTop: 10 }}>
              Add Image
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Image URLs:
              {productData.imageUrls.map((url, index) => (
                <div key={index}>{url}</div>
              ))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddProduct;
