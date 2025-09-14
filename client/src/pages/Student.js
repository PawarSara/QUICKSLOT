import React, { useState } from "react";

const Student = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [lecturesPerWeek, setLecturesPerWeek] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [breaks, setBreaks] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timetable, setTimetable] = useState(
    Array(8).fill(Array(5).fill("")) // 8 slots, 5 weekdays
  );

  const addSubject = (e) => {
    e.preventDefault();
    const newSubject = { name: subjectName, lectures: lecturesPerWeek, priority };
    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setLecturesPerWeek("");
    setPriority("");
  };

  const generateTimetable = (e) => {
    e.preventDefault();

    // Simple filling logic
    const newTimetable = timetable.map((row, rowIndex) =>
      row.map((cell, dayIndex) => selectedSubjects[rowIndex % selectedSubjects.length] || "")
    );

    setTimetable(newTimetable);

    alert(
      `Timetable generated with ${selectedSubjects.length} subjects, ${breaks} breaks, unavailable from ${startTime} to ${endTime}`
    );
  };

  const timeSlots = [
    "8:00 - 9:00",
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:30 - 14:30",
    "14:30 - 15:30",
    "15:30 - 16:30",
    "16:30 - 17:00",
  ];

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#ecf0f1" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Student Timetable Generator</h1>
        <div>
          <button
            style={{
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => alert("Teacher dashboard coming soon!")}
          >
            For Teachers
          </button>
          User: John Doe | <a href="#">Logout</a>
        </div>
      </div>

      {/* Add Subject Form */}
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2>Add Subject</h2>
        <form onSubmit={addSubject}>
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />
          <input
            type="number"
            placeholder="Lectures per week"
            value={lecturesPerWeek}
            onChange={(e) => setLecturesPerWeek(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer" }}>
            Add Subject
          </button>
        </form>
      </div>

      {/* Configure Timetable Form */}
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2>Configure Timetable</h2>
        <form onSubmit={generateTimetable}>
          <label>Select Subjects to Include:</label>
          <select
            multiple
            value={selectedSubjects}
            onChange={(e) =>
              setSelectedSubjects(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            required
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          >
            {subjects.map((sub, i) => (
              <option key={i} value={sub.name}>
                {sub.name} ({sub.priority}, {sub.lectures} lectures/week)
              </option>
            ))}
          </select>

          <label>Number of Breaks per Day:</label>
          <input
            type="number"
            value={breaks}
            onChange={(e) => setBreaks(e.target.value)}
            placeholder="e.g., 1"
            min="0"
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />

          <label>Time Constraints (Unavailable Periods)</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start Time"
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="End Time"
            style={{ display: "block", width: "100%", padding: "8px", margin: "8px 0", boxSizing: "border-box" }}
          />

          <button type="submit" style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer" }}>
            Generate Timetable
          </button>
        </form>
      </div>

      {/* Timetable Table */}
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2>Generated Timetable</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
          <thead>
            <tr>
              <th>Time / Day</th>
              {weekdays.map((day, i) => (
                <th key={i} style={{ border: "1px solid #bdc3c7", padding: "10px", backgroundColor: "#3498db", color: "white" }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #bdc3c7", padding: "10px" }}>{timeSlots[i]}</td>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: "1px solid #bdc3c7", padding: "10px" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student;
