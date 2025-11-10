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
        credentials: "include", // important for cookie-based auth
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "✅ Logged out successfully!");
        localStorage.removeItem("admin"); // remove frontend flag if you use it
        // small delay so cookies clear before redirect
        setTimeout(() => navigate("/admin/login"), 300);
      } else {
        toast.error(data.message || "❌ Logout failed!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("⚠️ Server error during logout.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">🍔 McDonald's Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-card">
          <h2>📦 Orders</h2>
          <p>Manage all incoming and completed orders here.</p>
          <button className="card-btn">View Orders</button>
        </section>

        <section className="dashboard-card">
          <h2>🍟 Menu Management</h2>
          <p>Update or modify items on the McDonald's menu.</p>
          <button className="card-btn">Manage Menu</button>
        </section>

        <section className="dashboard-card">
          <h2>👥 Customers</h2>
          <p>View customer details and feedback.</p>
          <button className="card-btn" onClick={() => navigate("/admin/customers")}>View Customers</button>
        </section>
      </main>
    </div>
  );
}
