import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TimeTableView.css";

const slots = [
  "9:30-10:30",
  "10:30-11:30",
  "11:30-12:30",
  "12:30-1:00 (Lunch)",
  "1:00-2:00",
  "2:00-3:00"
];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Color generator for subjects
const subjectColors = {};
const getColor = (subject) => {
  if (!subjectColors[subject]) {
    const colors = [
      "#FF6EC7", // bright pink
      "#7C4DFF", // vibrant purple
      "#1E90FF", // deep sky blue
      "#FF8C42", // bright orange
      "#00FA9A", // medium spring green
      "#FFD700", // gold
      "#FF4500", // orange red
      "#40E0D0"  // turquoise
    ];
    
    subjectColors[subject] =
      colors[Object.keys(subjectColors).length % colors.length];
  }
  return subjectColors[subject];
};

export default function TimeTableView() {
  const [timetable, setTimetable] = useState(null);
  const [semester, setSemester] = useState("3");
  const [division, setDivision] = useState("A");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (semester && division) {
      fetchTimetable();
    }
    // eslint-disable-next-line
  }, [semester, division]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/timetable/generate?semester=${semester}&division=${division}`
      );
      setTimetable(res.data.timetable);
    } catch (err) {
      console.error(err);
      setTimetable(null);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Delete Timetable Function ------------------
  const handleDeleteTimetable = async () => {
    if (!window.confirm("Are you sure you want to delete this timetable?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/timetable/delete?semester=${semester}&division=${division}`
      );
      alert("✅ Timetable deleted successfully.");
      setTimetable(null); // clears timetable
    } catch (error) {
      console.error("Error deleting timetable:", error);
      alert("❌ Failed to delete timetable.");
    }
  };

  return (
    <div className="timetable-wrapper">
      <h2>Weekly Timetable</h2>

      {/* Dropdowns */}
      <div className="dropdown-row">
        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </label>

        <label>
          Division:
          <select value={division} onChange={(e) => setDivision(e.target.value)}>
            {["A", "B"].map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading timetable...</p>
      ) : !timetable ? (
        <p className="no-timetable-text">
        No timetable found for Semester {semester} - Division {division}
        </p>

      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Time Slot</th>
              {weekdays.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot} className={slot.includes("Lunch") ? "lunch-row" : ""}>
                <td className={slot.includes("Lunch") ? "lunch-cell" : ""}>{slot}</td>
                {weekdays.map((day) => {
                  if (slot.includes("Lunch")) {
                    return (
                      <td key={day} className="lunch-cell">
                        Lunch Break
                      </td>
                    );
                  }
                  const lecture = timetable[day]?.[slot];
                  if (!lecture) return <td key={day}>-</td>;
                  return (
                    <td
                      key={day}
                      style={{ backgroundColor: getColor(lecture.subject) }}
                    >
                      <strong>{lecture.subject}</strong>
                      <br />
                      <small>{lecture.faculty}</small>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Timetable Button */}
      <button 
        className="delete-timetable-btn"
        onClick={handleDeleteTimetable}
      >
        Delete Timetable
      </button>

    </div>
  );
}
