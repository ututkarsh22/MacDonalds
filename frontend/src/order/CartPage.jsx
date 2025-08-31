import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('/api/order', {
        items: cartItems,
        total: totalPrice,
      });
      alert('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error(error);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="border-b pb-2 flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="font-semibold text-right text-lg">Total: ₹{totalPrice}</div>
          <button
            onClick={handlePlaceOrder}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
