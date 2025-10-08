import React from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // Check if admin is logged in
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleCreateTT = () => {
    navigate("/createTT");
  };

  const handleViewTT = () => {
    navigate("/viewTT"); // route to your timetable view page
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

        <button
          onClick={handleViewTT}
          disabled={!token}
          className="view-tt-button"
          style={{ marginTop: "10px" }}
        >
          View Timetable
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
