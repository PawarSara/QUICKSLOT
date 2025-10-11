import React, { useState } from "react";
import axios from "axios";
import "../styles/SubjectForm.css";

const semesterSubjects = {
  3: ["DSGT", "AOA", "COA", "MCE", "OE1"],
  4: ["CT", "DBMS", "OS", "MM", "OE2"],
  5: ["TCS", "CN", "DWM", "IP", "SE", "PCE"],
  6: ["CSS", "MC", "AI", "IOT", "SPCC"],
  7: ["ML", "BDA", "NLP", "BLOCK CHAIN", "ILOC"],
  8: ["DC", "ADS", "EM", "SMA"],
};

const yearToSemesters = {
  SE: [3, 4],
  TE: [5, 6],
  BE: [7, 8],
};

function SubjectForm() {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [division, setDivision] = useState(""); 
  const [subjects, setSubjects] = useState([]);
  const [hours, setHours] = useState({});
  const [message, setMessage] = useState("");

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setSemester("");
    setDivision("");
    setSubjects([]);
    setHours({});
    setMessage("");
  };

  const handleSemesterChange = (e) => {
    const sem = e.target.value;
    setSemester(sem);
    setDivision("");
    setSubjects(semesterSubjects[sem] || []);
    setHours({});
    setMessage("");
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    setMessage("");
  };

  const handleHoursChange = (subject, value) => {
    setHours({ ...hours, [subject]: value });
    setMessage(""); // Clear message on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !semester || !division || subjects.length === 0) {
      setMessage("❌ Please select year, semester, division, and enter subjects.");
      return;
    }

    const formattedSubjects = subjects.map(subj => ({
      name: subj,
      hoursPerWeek: Number(hours[subj]) >= 0 ? Number(hours[subj]) : 0
    }));

    // Calculate total hours
    const totalHours = formattedSubjects.reduce((sum, subj) => sum + subj.hoursPerWeek, 0);
    if (totalHours > 25) {
      setMessage(`❌ Total hours per week exceed 25. Currently: ${totalHours} hrs`);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/subject/add", {
        year,
        semester: Number(semester),
        division,
        subjects: formattedSubjects
      });

      setMessage(response.data.message);
      setYear("");
      setSemester("");
      setDivision("");
      setSubjects([]);
      setHours({});

    } catch (error) {
      console.error("❌ Axios error:", error.response || error);
      setMessage("❌ Error saving data: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="form-container">
        <h2 className="form-title">📘 Add Subject Hours</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Year:</label>
            <select value={year} onChange={handleYearChange} className="form-select" required>
              <option value="">-- Select Year --</option>
              {Object.keys(yearToSemesters).map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {year && (
            <div className="form-group">
              <label>Select Semester:</label>
              <select value={semester} onChange={handleSemesterChange} className="form-select" required>
                <option value="">-- Select Semester --</option>
                {yearToSemesters[year].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          )}

          {semester && (
            <div className="form-group">
              <label>Select Division:</label>
              <select value={division} onChange={handleDivisionChange} className="form-select" required>
                <option value="">-- Select Division --</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
              </select>
            </div>
          )}

          {subjects.length > 0 && division && (
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

          {subjects.length > 0 && division && (
            <button type="submit" className="submit-btn">Save Data</button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default SubjectForm;
