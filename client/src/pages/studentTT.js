import React, { useState } from "react";
import "../styles/studentTT.css";

function StudentTT() {
  const [deadline, setDeadline] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [subjectCount, setSubjectCount] = useState("");
  const [subjects, setSubjects] = useState([]);

  const generateSubjects = () => {
    const count = parseInt(subjectCount);
    if (isNaN(count) || count <= 0) {
      alert("Please enter a valid positive number of subjects");
      return;
    }
    const initialSubjects = Array.from({ length: count }, () => ({
      name: "",
      priority: "Low", // Capitalized to match enum in backend
      weightage: "",
    }));
    setSubjects(initialSubjects);
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!deadline || isNaN(Date.parse(deadline)) || new Date(deadline) <= new Date()) {
      alert("Enter a valid future deadline");
      return;
    }

    const hrs = parseFloat(hoursPerDay);
    if (isNaN(hrs) || hrs <= 0 || hrs > 24) {
      alert("Enter valid hours per day (1-24)");
      return;
    }

    if (subjects.length === 0) {
      alert("Please generate subjects first");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    for (let i = 0; i < subjects.length; i++) {
      const { name, priority, weightage } = subjects[i];
      if (!name.trim()) {
        alert(`Subject ${i + 1}: Name cannot be empty`);
        return;
      }
      if (!["High", "Medium", "Low"].includes(priority)) {
        alert(`Subject ${i + 1}: Invalid priority (must be High, Medium, or Low)`);
        return;
      }
      const w = parseFloat(weightage);
      if (isNaN(w) || w <= 0) {
        alert(`Subject ${i + 1}: Weightage must be positive`);
        return;
      }
    }

    // Add userId into each subject object
    const subjectsWithUserId = subjects.map((subj) => ({
      ...subj,
      userId,
    }));

    const timetableData = {
      deadline,
      hoursPerDay,
      subjects: subjectsWithUserId,
    };

    try {
      const response = await fetch("http://localhost:5000/api/timetable/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timetableData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Failed to save timetable: " + data.message);
        return;
      }

      console.log("✅ Timetable saved:", data);
      alert("Timetable saved successfully!");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Server not reachable. Make sure backend is running.");
    }
  };

  return (
    <div className="student-tt">
      <div className="student-tt-container">
        <h2>📚 Create Your Study Timetable</h2>
        <form className="student-tt-form" onSubmit={handleSubmit}>
          <label>Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <label>Hours per Day:</label>
          <input
            type="number"
            min="1"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            required
          />

          <label>Number of Subjects:</label>
          <input
            type="number"
            min="1"
            value={subjectCount}
            onChange={(e) => setSubjectCount(e.target.value)}
            required
          />
          <button type="button" onClick={generateSubjects}>
            Generate Subject Fields
          </button>

          {subjects.map((subj, index) => (
            <div key={index} className="subject-row">
              <label>Subject {index + 1} Name:</label>
              <input
                type="text"
                value={subj.name}
                onChange={(e) =>
                  handleSubjectChange(index, "name", e.target.value)
                }
                required
              />

              <label>Priority:</label>
              <select
                value={subj.priority}
                onChange={(e) =>
                  handleSubjectChange(index, "priority", e.target.value)
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label>Weightage (Hours or Importance):</label>
              <input
                type="number"
                min="1"
                value={subj.weightage}
                onChange={(e) =>
                  handleSubjectChange(index, "weightage", e.target.value)
                }
                required
              />
              <hr />
            </div>
          ))}

          <button type="submit">Submit Timetable</button>
        </form>
        <div className="background-glow"></div>
      </div>
    </div>
  );
}

export default StudentTT;

//updated one
