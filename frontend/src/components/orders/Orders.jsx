import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders', {
        withCredentials: true
      });
      setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const openHelpModal = () => {
    setShowHelpModal(true);
  };

  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const handleReorder = async (order) => {
    try {
      setLoading(true);
      
      // Create a new order with the same items and details
      const response = await axios.post('/api/orders/reorder', 
        { orderId: order._id },
        { withCredentials: true }
      );
      
      toast.success('Order placed successfully!');
      
      // Refresh orders list
      fetchOrders();
      
      // Close modal
      closeOrderDetails();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-container loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="orders-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start ordering your favorite meals!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <motion.div 
              key={order._id} 
              className="order-card"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-header">
                <div className="order-number">
                  <span>Order #</span>
                  <strong>{order.orderNumber}</strong>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-info">
                <div className="order-date">
                  <span>Ordered on:</span>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="order-type">
                  <span>Type:</span>
                  <p>{order.orderType}</p>
                </div>
                
                <div className="order-payment">
                  <span>Payment:</span>
                  <p>{order.paymentMethod}</p>
                </div>
                
                <div className="order-total">
                  <span>Total:</span>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="order-items-preview">
                <span>{order.items.length} item(s)</span>
                <p>
                  {order.items.slice(0, 2).map((item, index) => (
                    <span key={index}>
                      {item.quantity}x {item.name}
                      {index < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {order.items.length > 2 && <span> and {order.items.length - 2} more...</span>}
                </p>
              </div>
              
              <button className="view-details-btn">View Details</button>
            </motion.div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-details-overlay">
          <motion.div 
            className="order-details-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button className="close-modal" onClick={closeOrderDetails}>
              &times;
            </button>
            
            <div className="order-details-header">
              <h2>Order Details</h2>
              <div className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                {selectedOrder.status}
              </div>
            </div>
            
            <div className="order-details-info">
              <div className="detail-group">
                <span>Order Number:</span>
                <p>{selectedOrder.orderNumber}</p>
              </div>
              
              <div className="detail-group">
                <span>Date:</span>
                <p>{formatDate(selectedOrder.createdAt)}</p>
              </div>
              
              <div className="detail-group">
                <span>Order Type:</span>
                <p>{selectedOrder.orderType}</p>
              </div>
              
              <div className="detail-group">
                <span>Payment Method:</span>
                <p>{selectedOrder.paymentMethod}</p>
              </div>
              
              {selectedOrder.address && (
                <div className="detail-group">
                  <span>Delivery Address:</span>
                  <p>{selectedOrder.address}</p>
                </div>
              )}
            </div>
            
            <div className="order-items-list">
              <h3>Items</h3>
              <div className="items-table">
                <div className="items-header">
                  <div className="item-name">Item</div>
                  <div className="item-price">Price</div>
                  <div className="item-quantity">Qty</div>
                  <div className="item-total">Total</div>
                </div>
                
                {selectedOrder.items.map((item, index) => (
                  <div className="item-row" key={index}>
                    <div className="item-name">
                      <p>{item.name}</p>
                      {item.options && item.options.length > 0 && (
                        <small>
                          {item.options.map((option, i) => (
                            <span key={i}>{option}{i < item.options.length - 1 ? ', ' : ''}</span>
                          ))}
                        </small>
                      )}
                    </div>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                    <div className="item-quantity">{item.quantity}</div>
                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <p>${selectedOrder.subtotal.toFixed(2)}</p>
              </div>
              
              {selectedOrder.deliveryFee > 0 && (
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <p>${selectedOrder.deliveryFee.toFixed(2)}</p>
                </div>
              )}
              
              <div className="summary-row">
                <span>Tax:</span>
                <p>${selectedOrder.tax.toFixed(2)}</p>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <p>${selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="order-actions">
              <button 
                className="reorder-btn" 
                onClick={() => handleReorder(selectedOrder)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reorder'}
              </button>
              <button className="help-btn" onClick={openHelpModal}>Need Help?</button>
            </div>
          </motion.div>
        </div>
      )}

      {showHelpModal && (
        <div className="order-details-overlay">
          <motion.div 
            className="help-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button className="close-modal" onClick={closeHelpModal}>
              &times;
            </button>
            
            <div className="help-modal-header">
              <h2>Need Help?</h2>
            </div>
            
            <div className="help-modal-content">
              <p>If you have any questions or issues with your order, please contact our customer support:</p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span>Phone:</span>
                  <p>+91 1800-123-4567</p>
                </div>
                
                <div className="contact-item">
                  <span>Email:</span>
                  <p>support@mcdonaldsclone.com</p>
                </div>
                
                <div className="contact-item">
                  <span>Hours:</span>
                  <p>24/7 Customer Support</p>
                </div>
              </div>
              
              <div className="help-actions">
                <button className="primary-btn" onClick={closeHelpModal}>Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Orders;