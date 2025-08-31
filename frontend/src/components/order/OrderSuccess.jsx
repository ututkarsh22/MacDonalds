import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaReceipt, FaHome, FaUtensils } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        setOrder(data);
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
  
  if (isLoading) {
    return (
      <div className="order-success-page loading">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="order-success-page error">
        <div className="error-icon">❌</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/menu')}>Return to Menu</button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="order-success-page error">
        <div className="error-icon">❓</div>
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/menu')}>Return to Menu</button>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate estimated delivery time
  const getEstimatedDelivery = () => {
    if (order.estimatedDeliveryTime) {
      return formatDate(order.estimatedDeliveryTime);
    }
    
    if (order.orderType === 'Delivery') {
      const deliveryTime = new Date(order.createdAt);
      deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);
      return formatDate(deliveryTime);
    } else {
      const pickupTime = new Date(order.createdAt);
      pickupTime.setMinutes(pickupTime.getMinutes() + 15);
      return formatDate(pickupTime);
    }
  };
  
  return (
    <motion.div 
      className="order-success-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="order-success-container">
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <FaCheckCircle />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.div 
          className="order-details"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="order-number">
            <span>Order Number:</span> #{order.orderNumber}
          </div>
          
          <div className="order-date">
            <span>Order Date:</span> {formatDate(order.createdAt)}
          </div>
          
          <div className="order-type">
            <span>Order Type:</span> {order.orderType}
          </div>
          
          <div className="order-status">
            <span>Status:</span> <span className="status-badge">{order.status}</span>
          </div>
          
          <div className="delivery-time">
            <span>{order.orderType === 'Delivery' ? 'Estimated Delivery:' : 'Pickup Time:'}</span> 
            {getEstimatedDelivery()}
          </div>
          
          <div className="payment-info">
            <span>Payment Method:</span> {order.paymentMethod}
          </div>
          
          <div className="payment-status">
            <span>Payment Status:</span> 
            <span className={`payment-badge ${order.paymentStatus.toLowerCase()}`}>
              {order.paymentStatus}
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          className="order-summary"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2>Order Summary</h2>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="item-name">{item.name}</div>
                <div className="item-quantity">x{item.quantity}</div>
                <div className="item-price">₹{item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (18%):</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="total-row discount">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="action-buttons"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className="view-order-btn"
            onClick={() => navigate(`/orders/${orderId}`)}
          >
            <FaReceipt /> View Order Details
          </button>
          
          <button 
            className="track-order-btn"
            onClick={() => navigate('/orders')}
          >
            <FaUtensils /> My Orders
          </button>
          
          <button 
            className="home-btn"
            onClick={() => navigate('/')}
          >
            <FaHome /> Return Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;