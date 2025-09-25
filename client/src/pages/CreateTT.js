import React, { useState, useEffect } from "react";
import "../styles/CreateTT.css";
import { useNavigate } from "react-router-dom";

function CreateTT() {
  const navigate = useNavigate();

  // Check if admin is logged in
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Form state
  const [year, setYear] = useState("");
  const [division, setDivision] = useState("");
  const [slots, setSlots] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch subjects & faculties on load
  useEffect(() => {
    fetch("http://localhost:5000/api/subject")
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.log("Error fetching subjects:", err));

    fetch("http://localhost:5000/api/faculty")
      .then(res => res.json())
      .then(data => setFaculties(data))
      .catch(err => console.log("Error fetching faculties:", err));
  }, []);

  const handleSlotChange = (slotKey, field, value) => {
    setSlots(prev => ({
      ...prev,
      [slotKey]: {
        ...prev[slotKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year) return setMessage("Please select a year.");

    try {
      const response = await fetch("http://localhost:5000/api/timetable/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, division, slots })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error creating timetable.");
        return;
      }

      setMessage("✅ Timetable created successfully!");
      setYear("");
      setDivision("");
      setSlots({});
    } catch (err) {
      console.log("Error:", err);
      setMessage("❌ Server error. Make sure backend is running.");
    }
  };

  if (!token) {
    return (
      <div className="create-tt-page">
        <h2>Please login as admin to create timetable</h2>
      </div>
    );
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = ["1", "2", "3", "4", "5", "6"];

  return (
    <div className="create-tt-page">
      <h1>Create Timetable</h1>

      {message && <p className="message">{message}</p>}

      <form className="tt-form" onSubmit={handleSubmit}>
        <div className="tt-row">
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="SE">SE</option>
            <option value="TE">TE</option>
            <option value="BE">BE</option>
          </select>

          <label>Division:</label>
          <input
            type="text"
            placeholder="A / B"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          />
        </div>

        <table className="tt-table">
          <thead>
            <tr>
              <th>Day/Period</th>
              {periods.map(p => <th key={p}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                {periods.map(period => {
                  const slotKey = `${day}-${period}`;
                  return (
                    <td key={slotKey}>
                      <select
                        value={slots[slotKey]?.subject || ""}
                        onChange={(e) => handleSlotChange(slotKey, "subject", e.target.value)}
                      >
                        <option value="">Subject</option>
                        {subjects.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                      <select
                        value={slots[slotKey]?.faculty || ""}
                        onChange={(e) => handleSlotChange(slotKey, "faculty", e.target.value)}
                      >
                        <option value="">Faculty</option>
                        {faculties.map(f => (
                          <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="tt-submit-btn">Create Timetable</button>
      </form>
    </div>
  );
}

export default CreateTT;
