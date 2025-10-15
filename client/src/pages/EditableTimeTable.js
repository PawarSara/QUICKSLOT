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

const EditableTimeTable = () => {
  const [timetable, setTimetable] = useState(null);
  const [semester, setSemester] = useState("3");
  const [division, setDivision] = useState("A");
  const [subjects, setSubjects] = useState([]);
  const [editingCell, setEditingCell] = useState(null); // {day, slot}
  const [loading, setLoading] = useState(false);

  // Fetch timetable
  useEffect(() => {
    if (semester && division) fetchTimetable();
    fetchSubjects();
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

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subject/all");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCellClick = (day, slot) => {
    if (slot.includes("Lunch")) return;
    setEditingCell({ day, slot });
  };

  const handleChangeLecture = (subjectName) => {
    if (!editingCell) return;

    const day = editingCell.day;
    const slot = editingCell.slot;
    const lectureInfo = subjects
      .find((s) => s.subjectName === subjectName)
      ?.faculty || [];

    // Update timetable locally
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: { subject: subjectName, faculty: lectureInfo || "TBD" },
      },
    }));
    setEditingCell(null);
  };

  const handleSave = async () => {
    try {
      await axios.patch("http://localhost:5000/api/timetable/update", {
        semester,
        division,
        timetable,
      });
      alert("✅ Timetable saved successfully!");
      fetchTimetable(); // Refresh view
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("❌ Failed to save timetable.");
    }
  };

  // ---------------- Color generator ----------------
  const subjectColors = {};
  const getColor = (subject) => {
    if (!subject) return "#fff";
    if (!subjectColors[subject]) {
      const colors = ["#FF6EC7","#7C4DFF","#1E90FF","#FF8C42","#00FA9A","#FFD700","#FF4500","#40E0D0"];
      subjectColors[subject] =
        colors[Object.keys(subjectColors).length % colors.length];
    }
    return subjectColors[subject];
  };

  return (
    <div className="timetable-wrapper">
      <h2>Edit Weekly Timetable</h2>

      <div className="dropdown-row">
        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[3,4,5,6,7,8].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Division:
          <select value={division} onChange={(e) => setDivision(e.target.value)}>
            {["A","B"].map((d)=> <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading timetable...</p>
      ) : !timetable ? (
        <p className="no-timetable-text">No timetable found</p>
      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Time Slot</th>
              {weekdays.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => (
              <tr key={slot} className={slot.includes("Lunch") ? "lunch-row" : ""}>
                <td className={slot.includes("Lunch") ? "lunch-cell" : ""}>{slot}</td>
                {weekdays.map(day => {
                  if (slot.includes("Lunch")) {
                    return <td key={day} className="lunch-cell">Lunch Break</td>;
                  }
                  const lecture = timetable[day]?.[slot];
                  const isEditing = editingCell?.day===day && editingCell?.slot===slot;
                  return (
                    <td
                      key={day}
                      style={{ backgroundColor: getColor(lecture?.subject) }}
                      onClick={()=>handleCellClick(day, slot)}
                    >
                      {isEditing ? (
                        <select
                          onChange={(e)=>handleChangeLecture(e.target.value)}
                          value={lecture?.subject || ""}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(s=>(
                            <option key={s.subjectName} value={s.subjectName}>
                              {s.subjectName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <strong>{lecture?.subject}</strong><br/>
                          <small>{lecture?.faculty}</small>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

        <button className="save-changes-btn" onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditableTimeTable;
