import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCustomers.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/customers`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="customers-container">
      <header className="customers-header">
        <h1>👥 Customer Management</h1>
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>
      </header>

      {loading ? (
        <p className="loading-text">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="no-data">No customers found.</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>👤 Name</th>
              <th>📧 Email</th>
              <th>📅 Joined On</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
