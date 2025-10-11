import React, { useState } from "react";
import axios from "axios"; // ✅ important
import "../styles/FacultyForm.css";

export default function FacultyForm() {
  const [facultyName, setFacultyName] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState("");

  const semesters = {
    "Semester 3": ["DSGT", "AOA", "COA", "MCE", "OE1"],
    "Semester 4": ["CT", "DBMS", "OS", "MM", "OE2"],
    "Semester 5": ["TCS", "CN", "DWM", "IP", "SE", "PCE"],
    "Semester 6": ["CSS", "MC", "AI", "IOT", "SPCC"],
    "Semester 7": ["ML", "BDA", "NLP", "BLOCK CHAIN", "ILOC"],
    "Semester 8": ["DC", "ADS", "EM", "SMA"],
  };

  const handleCheckbox = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    if (!facultyName.trim()) {
      setMessage("⚠️ Please enter faculty name.");
      return;
    }
    if (selectedSubjects.length === 0) {
      setMessage("⚠️ Please select at least one subject.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/faculty/add", {
        facultyName,
        subjects: selectedSubjects,
      });

      setMessage(res.data.message); // ✅ message from backend
      setFacultyName("");
      setSelectedSubjects([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving faculty. Check backend!");
    }
  };

  return (
    <div className="faculty-page">
      {/* Glowing background */}
      <div className="background-glow top-left"></div>
      <div className="background-glow bottom-right"></div>
      <div className="background-glow center-top"></div>

      <div className="faculty-card">
        <h1 className="faculty-title">Add Faculty</h1>

        <div className="input-wrapper">
          <label>Faculty Name</label>
          <input
            type="text"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            placeholder="Enter faculty name"
          />
        </div>

        <div className="semesters-grid">
          {Object.entries(semesters).map(([sem, subjects]) => (
            <div className="semester-box" key={sem}>
              <h3>{sem}</h3>
              <div className="subject-grid">
                {subjects.map((sub) => (
                  <label key={sub} className="subject-chip">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(sub)}
                      onChange={() => handleCheckbox(sub)}
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          ➕ Add Faculty
        </button>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}
