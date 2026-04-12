import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch single order ──────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          { method: 'GET', credentials: 'include' }
        );
        if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch order');
        setOrder(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // ─── Helpers ────────────────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const shortId = (id) => '#' + id.slice(-8).toUpperCase();

  // ─── Loading ─────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="os-loading">
      <div className="os-spinner" />
      <p>Loading your order...</p>
    </div>
  );

  // ─── Error ───────────────────────────────────────────────────────
  if (error || !order) return (
    <div className="os-error">
      <p className="os-error-emoji">😕</p>
      <p className="os-error-title">Order not found</p>
      <p className="os-error-msg">{error || 'We could not find this order.'}</p>
      <button className="os-error-btn" onClick={() => navigate('/menu')}>
        Return to Menu
      </button>
    </div>
  );

  // ─── Subtotal from items ─────────────────────────────────────────
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.menuItemId.price * item.quantity, 0
  );

  // ─── Main UI ─────────────────────────────────────────────────────
  return (
    <div className="os-page">
      <div className="os-container">

        {/* ── Success Banner ── */}
        <div className="os-banner">
          <div className="os-check-circle">✅</div>
          <h1>Order Placed!</h1>
          <p className="os-banner-sub">
            Your order has been received and is being processed.
          </p>
          <span className="os-order-id-pill">{shortId(order._id)}</span>
        </div>

        {/* ── Order Status ── */}
        <div className="os-card">
          <div className="os-card-header">
            <div className="os-card-icon">📋</div>
            <p className="os-card-title">Order Status</p>
          </div>
          <div className="os-card-body">
            <div className="os-info-row">
              <p className="os-info-label">Order Status</p>
              <span className={`os-badge badge-${order.orderStatus}`}>
                <span className={`os-badge-dot dot-${order.orderStatus}`} />
                {order.orderStatus}
              </span>
            </div>
            <div className="os-info-row">
              <p className="os-info-label">Payment Status</p>
              <span className={`os-badge badge-${order.paymentStatus}`}>
                <span className={`os-badge-dot dot-${order.paymentStatus}`} />
                {order.paymentStatus}
              </span>
            </div>
            <div className="os-info-row">
              <p className="os-info-label">Payment Method</p>
              <span className={`os-badge badge-${order.paymentMethod}`}>
                {order.paymentMethod}
              </span>
            </div>
            <div className="os-info-row">
              <p className="os-info-label">Order Type</p>
              <p className="os-info-val">{order.orderType}</p>
            </div>
            <div className="os-info-row">
              <p className="os-info-label">Placed At</p>
              <p className="os-info-val">{formatDate(order.createdAt)}</p>
            </div>
            {order.address && (
              <div className="os-info-row">
                <p className="os-info-label">Address</p>
                <p className="os-info-val">{order.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Items Ordered ── */}
        <div className="os-card">
          <div className="os-card-header">
            <div className="os-card-icon">🍔</div>
            <p className="os-card-title">Items Ordered</p>
          </div>
          <div className="os-card-body">
            {order.items.map((item, i) => {
              const m = item.menuItemId;
              return (
                <div key={i} className="os-item">
                  <img src={m.image.url} alt={m.name} className="os-item-img" />
                  <div className="os-item-info">
                    <p className="os-item-name">{m.name}</p>
                    <p className="os-item-desc">{m.description}</p>
                    <div className="os-item-tags">
                      <span className={`os-item-tag ${m.isVegetarian ? 'tag-veg' : 'tag-nonveg'}`}>
                        {m.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                      {m.isPopular && (
                        <span className="os-item-tag tag-popular">⭐ Popular</span>
                      )}
                    </div>
                  </div>
                  <div className="os-item-right">
                    <p className="os-item-price">₹{m.price}</p>
                    <p className="os-item-qty">x{item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Price Summary ── */}
        <div className="os-card">
          <div className="os-card-header">
            <div className="os-card-icon">💰</div>
            <p className="os-card-title">Price Summary</p>
          </div>
          <div className="os-card-body">
            {order.items.map((item, i) => (
              <div key={i} className="os-price-row">
                <p className="os-price-label">
                  {item.menuItemId.name} × {item.quantity}
                </p>
                <p className="os-price-val">
                  ₹{item.menuItemId.price * item.quantity}
                </p>
              </div>
            ))}
            <div className="os-price-row">
              <p className="os-price-label">Subtotal</p>
              <p className="os-price-val">₹{subtotal}</p>
            </div>
            <div className="os-total-row">
              <p className="os-total-label">Total Paid</p>
              <p className="os-total-val">₹{order.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="os-actions">
          <button className="os-btn-primary" onClick={() => navigate('/orders')}>
            My Orders
          </button>
          <button className="os-btn-secondary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;