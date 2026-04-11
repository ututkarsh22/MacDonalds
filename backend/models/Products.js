import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: {type : Number, default : 0, min : 0},
  category: {
      type : String,
      enum : ["burgers", "chicken & sandwiches", "breakfast", "snacks & sides", "beverages", "desserts"],
      required : true,
    },
   image : {
    public_id : {type:String},
    url : {type : String}
   },
  isVegetarian: {type : Boolean},
  isPopular: {type : Boolean, default : false},
  stock: { type: Number, default: 0, min : 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
