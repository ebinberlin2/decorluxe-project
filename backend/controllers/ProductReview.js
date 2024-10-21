import Product from '../models/ProductReviewModel.js';

// Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, price, stockQuantity, status, imageUrls } = req.body;

    // Ensure imageUrls is an array
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    // Create a new product object
    const newProduct = new Product({
      name,
      description,
      category,
      subcategory,
      price,
      stockQuantity,
      imageUrls: urls, // Use the received imageUrls here
      status,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with the created product
    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Error adding product", error: error.message });
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
    const { name, description, category, subcategory, price, stockQuantity, imageUrls, status } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      category,
      subcategory,
      price,
      stockQuantity,
      imageUrls,
      status,
    }, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
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

// Get product by ID
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
