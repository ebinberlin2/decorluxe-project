import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/view');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProduct(product);
    setUpdatedData(product); // Initialize updatedData with the product to edit
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...updatedData.imageUrls];
    newImageUrls[index] = value;
    setUpdatedData((prevData) => ({
      ...prevData,
      imageUrls: newImageUrls,
    }));
  };

  const handleAddImageUrlField = () => {
    setUpdatedData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ''], // Add a new empty string for a new image URL field
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/edit/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Update the local state with the updated product
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id ? updatedData : product
          )
        );
        handleCloseEditDialog();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        View Products
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Subcategory</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.subcategory}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell>
                {product.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt="Product" style={{ width: 50 }} />
                ))}
              </TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleOpenEditDialog(product)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Product Dialog */}
      <Dialog open={open} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Product Name"
                type="text"
                fullWidth
                value={updatedData.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={updatedData.description}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="category"
                label="Category"
                type="text"
                fullWidth
                value={updatedData.category}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="subcategory"
                label="Subcategory"
                type="text"
                fullWidth
                value={updatedData.subcategory}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={updatedData.price}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="stockQuantity"
                label="Stock Quantity"
                type="number"
                fullWidth
                value={updatedData.stockQuantity}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="status"
                label="Status"
                type="text"
                fullWidth
                value={updatedData.status}
                onChange={handleInputChange}
              />
              
              {/* Separate input fields for each image URL */}
              <Typography variant="h6" gutterBottom>
                Image URLs
              </Typography>
              {updatedData.imageUrls.map((url, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={`Image URL ${index + 1}`}
                  type="text"
                  fullWidth
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                />
              ))}
              <Button onClick={handleAddImageUrlField} color="primary" style={{ marginTop: '8px' }}>
                Add Image URL
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProducts;
