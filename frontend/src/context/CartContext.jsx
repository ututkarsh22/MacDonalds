import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart from backend (runs once)
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCartItems(data.items || []);
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    };

    loadCart();
  }, []);

  // ✅ Calculate total dynamically (NO state needed)
  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // ✅ Sync cart with backend
  const updateCart = async (updatedItems) => {
    try {
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add-cart`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: updatedItems,
          total
        })
      });

    } catch (error) {
      toast.error("Sync error: " + error.message);
    }
  };

  // ✅ Add item
  const addToCart = (item) => {
    setCartItems(prevItems => {
      let updatedItems;

      const index = prevItems.findIndex(i => i._id === item._id);

      if (index !== -1) {
        updatedItems = [...prevItems];
        updatedItems[index].quantity += 1;
        toast.success(`Added another ${item.name}`);
      } else {
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
        toast.success(`${item.name} added`);
      }

      updateCart(updatedItems); // ✅ sync backend
      return updatedItems;
    });
  };

  // ✅ Remove item
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== itemId);
      updateCart(updatedItems);
      toast.success("Item removed");
      return updatedItems;
    });
  };

  // ✅ Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      let updatedItems;

      if (newQuantity < 1) {
        updatedItems = prevItems.filter(item => item._id !== itemId);
      } else {
        updatedItems = prevItems.map(item =>
          item._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      updateCart(updatedItems);
      return updatedItems;
    });
  };

  // ✅ Increment
  const incrementQuantity = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      updateCart(updatedItems);
      return updatedItems;
    });
  };

  // ✅ Decrement
  const decrementQuantity = (itemId) => {
    setCartItems(prevItems => {
      let updatedItems;

      const item = prevItems.find(i => i._id === itemId);

      if (item.quantity === 1) {
        updatedItems = prevItems.filter(i => i._id !== itemId);
      } else {
        updatedItems = prevItems.map(i =>
          i._id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }

      updateCart(updatedItems);
      return updatedItems;
    });
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems([]);
    updateCart([]);
    toast.success("Cart cleared");
  };

  // ✅ Derived value
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;