import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { Data } from '@react-google-maps/api';
import toast from 'react-hot-toast';
import { redirect } from 'react-router';

const CartPage = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, {
        method : 'POST',
        credentials : 'include',
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({   
          items: cartItems,
          totalAmount: totalPrice, 
        }),
      });
      const data = response.json();
      console.log( "I am response " ,data);
      toast.success("Order created successfull");
      clearCart();
      redirect('/order-success');
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
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
