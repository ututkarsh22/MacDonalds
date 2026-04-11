import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Logged out!");
        localStorage.removeItem("admin");
        navigate("/admin/login");
      } else {
        toast.error(data.message || "Logout failed!");
      }
    } catch (error) {
      toast.error("Server error during logout.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-area">
          <span className="m-logo">M</span>
          <h1 className="dashboard-title">Admin <span>Panel</span></h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <div className="card-icon">📦</div>
          <h2>Orders</h2>
          <p>Track, update and manage all live customer orders.</p>
          <button className="card-btn" onClick={() => navigate("/admin/orders")}>View Orders</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🍟</div>
          <h2>Menu</h2>
          <p>Add new items or change prices in the digital menu.</p>
          <button className="card-btn" onClick={() => navigate("/admin/menu")}>Manage Menu</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h2>Customers</h2>
          <p>Manage user database and view account details.</p>
          <button className="card-btn" onClick={() => navigate("/admin/customers")}>View Users</button>
        </div>
      </main>
    </div>
  );
}