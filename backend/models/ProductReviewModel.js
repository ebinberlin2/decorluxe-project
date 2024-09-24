import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },   // Added category field
  subcategory: { type: String, required: true },  // Added subcategory field
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active',
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
