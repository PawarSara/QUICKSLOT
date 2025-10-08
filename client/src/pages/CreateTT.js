// src/pages/CreateTT.js
import React, { useState } from "react";
import "../styles/CreateTT.css";

function CreateTT() {
  const [year, setYear] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [numSubjects, setNumSubjects] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Handle subject generation
  const handleGenerateSubjects = () => {
    const arr = [];
    for (let i = 0; i < numSubjects; i++) {
      arr.push({ name: "", faculty: "", lecturesPerWeek: "" });
    }
    setSubjects(arr);
  };

  // Update subject info
  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  // Handle form submit with POST request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !division || !semester || subjects.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/timetable/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, division, semester, subjects }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Timetable saved successfully!");
        console.log("Saved timetable:", data.timetable);

        // Reset form
        setYear("");
        setDivision("");
        setSemester("");
        setNumSubjects("");
        setSubjects([]);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving timetable");
    }
  };

  return (
    <div className="createTT-container">
      <h2 className="title">Create Timetable</h2>

      <form onSubmit={handleSubmit} className="tt-form">
        {/* Year */}
        <div className="form-group">
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} required>
            <option value="">Select Year</option>
            <option value="SE">SE</option>
            <option value="TE">TE</option>
            <option value="BE">BE</option>
          </select>
        </div>

        {/* Division */}
        <div className="form-group">
          <label>Division:</label>
          <select value={division} onChange={(e) => setDivision(e.target.value)} required>
            <option value="">Select Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>

        {/* Semester */}
        <div className="form-group">
          <label>Semester:</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
            <option value="">Select Semester</option>
            {year === "SE" && (
              <>
                <option value="3">3</option>
                <option value="4">4</option>
              </>
            )}
            {year === "TE" && (
              <>
                <option value="5">5</option>
                <option value="6">6</option>
              </>
            )}
            {year === "BE" && (
              <>
                <option value="7">7</option>
                <option value="8">8</option>
              </>
            )}
          </select>
        </div>

        {/* Number of Subjects */}
        <div className="form-group">
          <label>No. of Subjects:</label>
          <input
            type="number"
            min="1"
            value={numSubjects}
            onChange={(e) => setNumSubjects(e.target.value)}
            required
          />
          <button type="button" className="generate-btn" onClick={handleGenerateSubjects}>
            Generate Fields
          </button>
        </div>

        {/* Generated Inputs */}
        {subjects.length > 0 && (
          <div className="subjects-section">
            <h3>Enter Subject Details</h3>
            {subjects.map((sub, index) => (
              <div key={index} className="subject-card">
                <label>Subject {index + 1}:</label>
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={sub.name}
                  onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Faculty Name"
                  value={sub.faculty}
                  onChange={(e) => handleSubjectChange(index, "faculty", e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Lectures per week"
                  value={sub.lecturesPerWeek}
                  onChange={(e) => handleSubjectChange(index, "lecturesPerWeek", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateTT;
