import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';

// Hardcoded base URL
const BASE_URL = 'http://localhost:5000'; // Change this to your actual base URL

const categories = {
  'Furniture': [
    'Chair',
    'Table',
    'Sofa',
    'Bed',
    'Desk',
    'Bookshelf',
    'Cabinet',
  ],
  'Lighting': [
    'Chandelier',
    'Table Lamp',
    'Floor Lamp',
    'Wall Sconce',
    'Pendant Light',
    'Outdoor Light',
    'Track Lighting',
  ],
  'Decoration': [
    'Wall Art',
    'Mirror',
    'Rug',
    'Curtain',
    'Vase',
    'Candle Holder',
    'Wall Clock',
  ],
  'Bedding': [
    'Duvet',
    'Pillow',
    'Bed Sheet',
    'Bed Frame',
    'Comforter',
    'Bed Skirt',
    'Bedding Set',
  ],
  'Storage': [
    'Shelf',
    'Storage Bin',
    'Wardrobe',
    'Shoe Rack',
    'Chest of Drawers',
    'Cabinet',
    'Trunk',
  ],
  'Outdoor': [
    'Patio Chair',
    'Garden Table',
    'Lounge Chair',
    'Umbrella',
    'Fire Pit',
    'Outdoor Sofa',
    'BBQ Grill',
  ],
  'Office': [
    'Office Chair',
    'Desk',
    'Filing Cabinet',
    'Bookcase',
    'Conference Table',
    'Cubicle',
    'Desk Organizer',
  ],
  'Children’s Furniture': [
    'Bunk Bed',
    'Toy Box',
    'Kids Chair',
    'Kids Desk',
    'Changing Table',
    'Playhouse',
    'Crib',
  ],
};

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    additionalDescription: '',
    category: '',
    subcategory: '',
    price: 0,
    stockQuantity: 0,
    imageUrls: [],
    newImageUrl: '',
    measurements: {
      width: '',
      height: '',
      depth: '',
      weight: ''
    },
    status: 'active',
    userId: '', // Initialize userId here
  });
  
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user ID from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT
        // Check if the token contains an ID and set it in productData
        if (decodedToken.id) {
          setProductData((prevData) => ({ ...prevData, userId: decodedToken.id }));
        }
      } catch (error) {
        console.error('Invalid token:', error); // Handle invalid token
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle nested measurements input changes
  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      measurements: {
        ...prevData.measurements,
        [name]: value,
      }
    }));
  };

  // Handle category change and dynamically set subcategories
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSubcategories(categories[category] || []);
    setProductData({ ...productData, category, subcategory: '' });
  };

  // Handle adding image URL to list with validation
  const handleAddImageUrl = () => {
    const { newImageUrl } = productData;
    const urlPattern = /(http(s)?:\/\/.*\.(?:png|jpg|jpeg|gif))/i; // Basic URL regex pattern
    if (newImageUrl.trim() && urlPattern.test(newImageUrl)) {
      setProductData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, newImageUrl],
        newImageUrl: '',
      }));
      setError(''); // Clear any previous error
    } else {
      setError('Please enter a valid image URL.');
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
  
    // Log the product data before submission
    console.log('Submitting Product Data:', productData);
  
    try {
      const token = localStorage.getItem('authToken'); // Retrieve the token
      const response = await fetch(`${BASE_URL}/api/products/add`, { // Use the hardcoded base URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(productData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        // Reset the form
        setProductData({
          name: '',
          description: '',
          additionalDescription: '',
          category: '',
          subcategory: '',
          price: 0,
          stockQuantity: 0,
          imageUrls: [],
          newImageUrl: '',
          measurements: {
            width: '',
            height: '',
            depth: '',
            weight: ''
          },
          status: 'active',
          userId: '', // Reset userId
        });
      } else {
        setError(result.message || 'Failed to add product.');
      }
    } catch (error) {
      setError('An error occurred while adding the product.');
      console.error('Submit Error:', error); // Log any additional errors
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
                disabled={!productData.category} // Disable if no category is selected
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
              inputProps={{ min: 0 }} // Prevent negative prices
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
              inputProps={{ min: 0 }} // Prevent negative stock
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="description"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={productData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="additionalDescription"
              name="additionalDescription"
              label="Additional Description"
              fullWidth
              multiline
              rows={4}
              value={productData.additionalDescription}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="newImageUrl"
              name="newImageUrl"
              label="Add Image URL"
              fullWidth
              value={productData.newImageUrl}
              onChange={handleInputChange}
            />
            <Button variant="outlined" onClick={handleAddImageUrl}>
              Add Image
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Image URLs:</Typography>
            {productData.imageUrls.map((url, index) => (
              <Typography key={index}>{url}</Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Measurements:</Typography>
            <TextField
              id="width"
              name="width"
              label="Width"
              fullWidth
              value={productData.measurements.width}
              onChange={handleMeasurementChange}
            />
            <TextField
              id="height"
              name="height"
              label="Height"
              fullWidth
              value={productData.measurements.height}
              onChange={handleMeasurementChange}
            />
            <TextField
              id="depth"
              name="depth"
              label="Depth"
              fullWidth
              value={productData.measurements.depth}
              onChange={handleMeasurementChange}
            />
            <TextField
              id="weight"
              name="weight"
              label="Weight"
              fullWidth
              value={productData.measurements.weight}
              onChange={handleMeasurementChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddProduct;
