import mongoose from "mongoose"


const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  total: Number,
});

const Cart =  mongoose.model("Cart", CartSchema);
export default Cart;
