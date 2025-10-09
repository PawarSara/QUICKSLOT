import React, { useState } from "react";
import axios from "axios";
import "../styles/SubjectForm.css";

const semesterSubjects = {
  3: ["DSGT", "AOA", "COA", "MCE", "OE"],
  4: ["CT", "DBMS", "OS", "MM", "OE"],
  5: ["TCS", "CN", "DWM", "IP", "SE", "PCE"],
  6: ["CSS", "MC", "AI", "IOT", "SPCC"],
  7: ["ML", "BDA", "NLP", "BLOCK CHAIN", "ILOC"],
  8: ["DC", "ADS", "EM", "SMA"],
};

function SubjectForm() {
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [hours, setHours] = useState({});
  const [message, setMessage] = useState("");

  const handleSemesterChange = (e) => {
    const sem = e.target.value;
    setSemester(sem);
    setSubjects(semesterSubjects[sem] || []);
    setHours({});
    setMessage("");
  };

  const handleHoursChange = (subject, value) => {
    setHours({ ...hours, [subject]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedSubjects = subjects.map((subj) => ({
      name: subj,
      hoursPerWeek: Number(hours[subj]) || 0,
    }));

    try {
      await axios.post("http://localhost:5000/api/subject/add", {
        semester,
        subjects: formattedSubjects,
      });
      setMessage("✅ Data saved successfully!");
      setSemester("");
      setSubjects([]);
      setHours({});
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving data.");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="form-container">
        <h2 className="form-title">📘 Add Subject Hours</h2>

        <form onSubmit={handleSubmit}>
          {/* Semester Dropdown */}
          <div className="form-group">
            <label>Select Semester:</label>
            <select
              value={semester}
              onChange={handleSemesterChange}
              className="form-select"
              required
            >
              <option value="">-- Select --</option>
              {[3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{`Semester ${sem}`}</option>
              ))}
            </select>
          </div>

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="subject-list">
              {subjects.map((subject, index) => (
                <div key={index} className="subject-row">
                  <span>{subject}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Hours/week"
                    value={hours[subject] || ""}
                    onChange={(e) => handleHoursChange(subject, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          {subjects.length > 0 && (
            <button type="submit" className="submit-btn">
              Save Data
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default SubjectForm;
