import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import './Payment.css';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  
  // Initialize Razorpay payment
  const initializeRazorpay = async () => {
    try {
      // Fetch Razorpay key from backend
      const keyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/key`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!keyResponse.ok) {
        throw new Error('Failed to fetch Razorpay key');
      }
      
      const keyData = await keyResponse.json();
      
      // Create Razorpay order
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, amount: order.total * 100 }) // amount in paise
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }
      
      const data = await response.json();
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => openRazorpayCheckout(data.order, keyData.key);
      document.body.appendChild(script);
    } catch (err) {
      console.error('Payment initialization error:', err);
      toast.error(err.message);
    }
  };
  
  // Open Razorpay checkout
  const openRazorpayCheckout = (razorpayOrder, razorpayKey) => {
    const options = {
      key: razorpayKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'McDonald\'s Clone',
      description: `Order #${order.orderNumber}`,
      order_id: razorpayOrder.id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: order.userId.name,
        email: order.userId.email,
        contact: order.userId.phone || ''
      },
      theme: {
        color: '#ffbc0d'
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment with backend
      const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature
        })
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }
      
      // Payment successful
      toast.success('Payment successful!');
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error('Payment verification error:', err);
      toast.error(err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="payment-page loading">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="payment-page error">
        <div className="error-icon">❌</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/menu')}>Return to Menu</button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="payment-page error">
        <div className="error-icon">❓</div>
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/menu')}>Return to Menu</button>
      </div>
    );
  }
  
  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Payment</h1>
        
        <div className="order-info">
          <div className="order-number">Order #{order.orderNumber}</div>
          <div className="order-total">Total: ₹{order.total.toFixed(2)}</div>
        </div>
        
        <div className="payment-method">
          <h2>Payment Method: {order.paymentMethod}</h2>
          <p>Please complete your payment to confirm your order.</p>
        </div>
        
        <button 
          className="pay-now-btn"
          onClick={initializeRazorpay}
        >
          Pay Now
        </button>
        
        <button 
          className="cancel-btn"
          onClick={() => navigate(`/orders/${orderId}`)}
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;