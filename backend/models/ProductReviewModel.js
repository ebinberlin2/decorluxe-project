import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  additionalDescription: { type: String }, // New field for extra details
  category: { type: String, required: true },   // Existing category field
  subcategory: { type: String, required: true }, // Existing subcategory field
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  imageUrls: [{ type: String }],
  measurements: {
    width: { type: Number },  // Measurement field for width
    height: { type: Number }, // Measurement field for height
    depth: { type: Number },   // Measurement field for depth
    weight: { type: Number },  // Measurement field for weight
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active',
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
