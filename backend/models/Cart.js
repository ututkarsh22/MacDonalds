import mongoose from "mongoose"


const CartSchema = new mongoose.Schema({
  userId: { 
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
   }, 
  items: [
    {
      productId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
      },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  total: Number,
});

const Cart =  mongoose.model("Cart", CartSchema);
export default Cart;
