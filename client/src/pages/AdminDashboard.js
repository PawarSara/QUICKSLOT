import React from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // Check if admin is logged in
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleCreateTT = () => {
    navigate("/createTT");
 // or your timetable creation page
  };

  return (
    <div className="admin-dashboard-page">
      {/* Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="sparkle"></div>
      ))}

      <div className="admin-dashboard-card">
        <h1>Welcome Admin</h1>
        <button
          onClick={handleCreateTT}
          disabled={!token}
          className="create-tt-button"
        >
          Create Timetable
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
