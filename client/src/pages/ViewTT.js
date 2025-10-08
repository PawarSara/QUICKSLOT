// src/pages/ViewTT.js
import React, { useEffect, useState } from "react";

function ViewTT() {
  const [timetable, setTimetable] = useState({});

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable") // get all timetables
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const latestTT = data[0]; // take latest timetable
          setTimetable(generateSchedule(latestTT.subjects));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Generate timetable grid based on lecturesPerWeek
  const generateSchedule = (subjects) => {
    const schedule = {}; // { Monday: [], Tuesday: [], ... }
    days.forEach((day) => (schedule[day] = Array(slots.length).fill("")));

    let currentDay = 0;
    let currentSlot = 0;

    subjects.forEach((sub) => {
      for (let i = 0; i < sub.lecturesPerWeek; i++) {
        schedule[days[currentDay]][currentSlot] = `${sub.name} (${sub.faculty})`;

        currentSlot++;
        if (currentSlot >= slots.length) {
          currentSlot = 0;
          currentDay++;
          if (currentDay >= days.length) currentDay = 0; // loop if overflow
        }
      }
    });

    return schedule;
  };

  return (
    <div className="viewTT-container">
      <h2>Weekly Timetable</h2>
      {Object.keys(timetable).length > 0 ? (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr key={index}>
                <td>{slot}</td>
                {days.map((day) => (
                  <td key={day}>{timetable[day][index]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timetable found</p>
      )}
    </div>
  );
}

export default ViewTT;
