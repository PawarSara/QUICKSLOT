import React, { useState } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUser, FaEye, FaCalendarAlt, FaEdit } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [timetableOpen, setTimetableOpen] = useState(false);

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome Admin</h1>

        <div className="dashboard-grid">
          {/* Add Subject Hours */}
          <div className="dashboard-card" onClick={() => navigate("/SubjectForm")}>
            <FaBook className="card-icon" />
            <h2>Add Subject Hours</h2>
          </div>

          {/* Faculty Dropdown */}
          <div className="dashboard-card faculty-wrapper">
            <div
              className="faculty-card-header"
              onClick={() => setFacultyOpen(!facultyOpen)}
            >
              <FaUser className="card-icon" />
              <h2>Faculty</h2>
              <span className="toggle-arrow">{facultyOpen ? "▲" : "▼"}</span>
            </div>

            <div className={`faculty-options-panel ${facultyOpen ? "open" : ""}`}>
              <div className="faculty-option" onClick={() => navigate("/FacultyForm")}>
                <FaUser /> Add Faculty
              </div>
              <div className="faculty-option" onClick={() => navigate("/ViewFaculty")}>
                <FaEye /> View Faculty
              </div>
            </div>
          </div>

          {/* Timetable Dropdown */}
          <div className="dashboard-card faculty-wrapper">
            <div
              className="faculty-card-header"
              onClick={() => setTimetableOpen(!timetableOpen)}
            >
              <FaCalendarAlt className="card-icon" />
              <h2>Timetable</h2>
              <span className="toggle-arrow">{timetableOpen ? "▲" : "▼"}</span>
            </div>

            <div className={`faculty-options-panel ${timetableOpen ? "open" : ""}`}>
              <div
                className="faculty-option"
                onClick={() => navigate("/TimeTableView")}
              >
                <FaEye /> View Timetable
              </div>
              <div
                className="faculty-option"
                onClick={() => navigate("/EditableTimeTable")}
              >
                <FaEdit /> Edit Timetable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
