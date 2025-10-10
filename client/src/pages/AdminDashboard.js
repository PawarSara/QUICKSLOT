import React from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleAddSubjectHours = () => {
    navigate("/SubjectForm");
  };

  const handleAddFaculty = () => {
    navigate("/AddFaculty");
  };

  const handleViewTT = () => {
    navigate("/viewTT");
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
          onClick={handleAddSubjectHours}
          disabled={!token}
          className="create-tt-button"
        >
          Add Subject Hours
        </button>

        <button
          onClick={handleAddFaculty}
          disabled={!token}
          className="create-tt-button"
          style={{ marginTop: "10px" }}
        >
          Add Faculty
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
