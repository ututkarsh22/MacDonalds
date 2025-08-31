import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState('Dine-In');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
    
    // Redirect to menu if cart is empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/menu');
    }
  }, [isAuthenticated, cartItems, navigate]);
  
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare order data
      const orderData = {
        orderType,
        paymentMethod,
        address: orderType === 'Takeaway' ? address : '',
        items: cartItems.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
          options: [],
          specialInstructions: ''
        }))
      };
      
      // Make API call to create order
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      
      // If payment method is Card or UPI, initiate Razorpay payment
      if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
        // Navigate to payment page with order ID
        navigate(`/payment/${data.order._id}`);
      } else {
        // For Cash payment, show success and clear cart
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-sections">
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="price-summary">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Tax (18%):</span>
                <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
              </div>
              {orderType === 'Takeaway' && (
                <div className="price-row">
                  <span>Delivery Fee:</span>
                  <span>₹40.00</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total:</span>
                <span>
                  ₹{(cartTotal + (cartTotal * 0.18) + (orderType === 'Takeaway' ? 40 : 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="order-details-section">
            <h2>Order Details</h2>
            
            <div className="form-group">
              <label>Order Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="orderType" 
                    value="Dine-In" 
                    checked={orderType === 'Dine-In'}
                    onChange={() => setOrderType('Dine-In')}
                  />
                  Dine-In
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="orderType" 
                    value="Takeaway" 
                    checked={orderType === 'Takeaway'}
                    onChange={() => setOrderType('Takeaway')}
                  />
                  Takeaway
                </label>
              </div>
            </div>
            
            {orderType === 'Takeaway' && (
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Payment Method</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Card" 
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                  />
                  Card
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="UPI" 
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  UPI
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash" 
                    checked={paymentMethod === 'Cash'}
                    onChange={() => setPaymentMethod('Cash')}
                  />
                  Cash
                </label>
              </div>
            </div>
            
            <motion.button 
              className="place-order-btn"
              whileTap={{ scale: 0.95 }}
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;