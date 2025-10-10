import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TimeTableView.css";

const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Generate color for each subject
const subjectColors = {};
const getColor = (subject) => {
  if (!subjectColors[subject]) {
    const colors = ["#FFB6C1","#87CEFA","#90EE90","#FFA07A","#9370DB","#F0E68C","#FF69B4","#20B2AA"];
    subjectColors[subject] = colors[Object.keys(subjectColors).length % colors.length];
  }
  return subjectColors[subject];
};

export default function TimeTableView() {
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/timetable/generate");
        setTimetable(res.data.timetable);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimetable();
  }, []);

  if (!timetable) return <p>Loading timetable...</p>;

  return (
    <div className="timetable-wrapper">
      <h2>Weekly Timetable</h2>
      <table className="timetable">
        <thead>
          <tr>
            <th>Time Slot</th>
            {weekdays.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot} className={slot === "12:30-1:00" ? "lunch-row" : ""}>
              <td className={slot === "12:30-1:00" ? "lunch-cell" : ""}>{slot}</td>
              {weekdays.map(day => {
                const lecture = timetable[day][slot];
                if (!lecture) {
                  return <td key={day} className={slot === "12:30-1:00" ? "lunch-cell" : ""}>-</td>;
                }
                return (
                  <td
                    key={day}
                    style={{ backgroundColor: getColor(lecture.subject) }}
                  >
                    <strong>{lecture.subject}</strong><br />
                    <small>{lecture.faculty}</small>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note"><strong>Note:</strong> Lunch break is highlighted in gray.</p>
    </div>
  );
}
