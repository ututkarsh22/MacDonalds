import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";


const HomePage = () => {
  const { cartItems, updateQuantity } = useContext(CartContext);

  const handleAddToCart = (id) => {
    const item = cartItems.find((item) => item.id === id);
    updateQuantity(id, item.qty + 1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🍔 Welcome to McDonald's Clone</h2>

      {cartItems.map((item) => (
        <div key={item.id} className="border-b py-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p>Price: ₹{item.price}</p>
          </div>
          <button
            onClick={() => handleAddToCart(item.id)}
            className="bg-yellow-400 px-4 py-1 rounded text-black"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
