import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' }, // optional
  category: { type: String, default: '' },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
