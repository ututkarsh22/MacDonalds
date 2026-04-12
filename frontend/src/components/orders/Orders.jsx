import React, { useState, useEffect } from 'react';
import './Orders.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/allOrders?page=${currentPage}&limit=10`,
          { method: 'GET', credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (isLoading) return (
    <div className="ol-loading">
      <div className="ol-spinner" />
      <p>Fetching your orders...</p>
    </div>
  );

  if (error) return (
    <div className="ol-error">
      <p className="ol-error-emoji">😕</p>
      <p className="ol-error-title">Something went wrong</p>
      <p className="ol-error-msg">{error}</p>
    </div>
  );

  return (
    <div className="ol-page">

      {/* ── Header ── */}
      <div className="ol-header">
        <div className="ol-header-inner">
          <div>
            <h1>My Orders</h1>
            <p>{pagination.total} total orders</p>
          </div>
          <span className="ol-header-badge">{pagination.total} Orders</span>
        </div>
      </div>

      {/* ── List ── */}
      <div className="ol-list">
        {orders.length === 0 ? (
          <div className="ol-empty">
            <p className="ol-empty-emoji">🛒</p>
            <h2>No orders yet</h2>
            <p>Your placed orders will appear here</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} formatDate={formatDate} />
          ))
        )}

        {/* ── Pagination ── */}
        {pagination.pages > 1 && (
          <div className="ol-pagination">
            <button
              className="ol-page-btn"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <span className="ol-page-info">{pagination.page} / {pagination.pages}</span>
            <button
              className="ol-page-btn"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === pagination.pages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Order Card
// ─────────────────────────────────────────────────────────────────────────────

const OrderCard = ({ order, formatDate }) => {
  const [expanded, setExpanded] = useState(false);
  const firstItem = order.items[0];

  return (
    <div className="oc-card">

      {/* Main row */}
      <div className="oc-main">

        {/* Image */}
        <div className="oc-img-wrap">
          <img
            src={firstItem?.menuItemId?.image?.url}
            alt={firstItem?.menuItemId?.name}
            className="oc-img"
          />
          {order.items.length > 1 && (
            <span className="oc-img-extra">+{order.items.length - 1}</span>
          )}
        </div>

        {/* Info */}
        <div className="oc-info">
          <p className="oc-name">
            {order.items.map(i => i.menuItemId?.name).join(', ')}
          </p>
          <p className="oc-date">{formatDate(order.createdAt)}</p>
          <div className="oc-badges">
            <span className={`oc-status status-${order.orderStatus}`}>
              <span className={`oc-dot dot-${order.orderStatus}`} />
              {order.orderStatus}
            </span>
            <span className="oc-type-badge">{order.orderType}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="oc-amount">
          <p className="oc-amount-val">₹{order.totalAmount}</p>
          <p className="oc-order-id">#{order._id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      {/* Toggle */}
      <button className="oc-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▲ Hide details' : '▼ Order details'}
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className="oc-panel">

          {/* Items */}
          <div>
            <p className="oc-section-label">Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} className="oc-item-row">
                <img
                  src={item.menuItemId?.image?.url}
                  alt={item.menuItemId?.name}
                  className="oc-item-img"
                />
                <div>
                  <p className="oc-item-name">{item.menuItemId?.name}</p>
                  <p className="oc-item-qty">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div>
            <p className="oc-section-label">Order Info</p>
            <div className="oc-meta-grid">
              <MetaBox icon="💳" label="Payment Method" value={order.paymentMethod} />
              <MetaBox icon="📋" label="Payment Status" value={order.paymentStatus} />
              <MetaBox icon="🍽️" label="Order Type"     value={order.orderType} />
              <MetaBox icon="📍" label="Address"        value={order.address || 'Dine-In'} />
            </div>
          </div>

          {/* Total */}
          <div className="oc-total">
            <p className="oc-total-label">Total Paid</p>
            <p className="oc-total-val">₹{order.totalAmount}</p>
          </div>

        </div>
      )}
    </div>
  );
};

// ─── Meta Box ─────────────────────────────────────────────────────────────────

const MetaBox = ({ icon, label, value }) => (
  <div className="oc-meta-box">
    <p className="oc-meta-label">{icon} {label}</p>
    <p className="oc-meta-val">{value}</p>
  </div>
);

export default OrdersList;