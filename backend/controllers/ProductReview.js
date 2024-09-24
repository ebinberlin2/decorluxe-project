import Product from '../models/ProductReviewModel.js';

// Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, price, stockQuantity, imageUrl, status } = req.body;

    // Validate required fields
    if (!name || !category || !subcategory || price == null || stockQuantity == null) {
      return res.status(400).json({ error: 'Name, category, subcategory, price, and stockQuantity fields are required.' });
    }

    // Create a new product
    const product = new Product({
      name,
      description,
      category,
      subcategory,
      price,
      stockQuantity,
      imageUrl,
      status: status || 'active', // Default status to 'active' if not provided
    });

    // Save to the database
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error adding product:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to add product. Please try again later.' });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // Use 200 status for successful retrieval
  } catch (err) {
    console.error('Error fetching products:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, price, stockQuantity, imageUrl, status } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      category,
      subcategory,
      price,
      stockQuantity,
      imageUrl,
      status,
    }, { new: true, runValidators: true }); // Run validators to ensure data integrity

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct); // Use 200 status for successful update
  } catch (err) {
    console.error('Error updating product:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to update product. Please try again later.' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' }); // Use 200 status for successful deletion
  } catch (err) {
    console.error('Error deleting product:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete product. Please try again later.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};
