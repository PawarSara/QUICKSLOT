import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewFaculty.css";

function ViewFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Fetch faculty data on mount
  useEffect(() => {
    fetchFaculty();
  }, []);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faculty/all");
      setFacultyList(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setMessage("❌ Failed to load faculty data.");
    }
  };

  const confirmDelete = (id) => {
    setFacultyToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/faculty/delete/${facultyToDelete}`);
      setMessage("✅ Faculty deleted successfully.");
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setMessage("❌ Failed to delete faculty.");
    }
    setShowModal(false);
  };

  return (
    <div className="view-faculty-page">
      <div className="faculty-card">
        <h2 className="view-faculty-title">Faculty List</h2>

        {message && (
          <div className={`message-box ${message.startsWith("✅") ? "success" : "error"}`}>
            {message.slice(2)}
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.length > 0 ? (
              facultyList.map((faculty) => (
                <tr key={faculty._id}>
                  <td>{faculty.facultyName}</td>
                  <td>
                    {faculty.subjects.map((subj, i) => (
                      <span key={i} className="subject-badge">{subj}</span>
                    ))}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(faculty._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No faculty found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p>Are you sure you want to delete this faculty?</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={handleDelete}>Yes</button>
              <button
                className="delete-btn"
                style={{ background: "#555" }}
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewFaculty;
