import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TimeTableView.css";

const slots = [
  "9:30-10:30",
  "10:30-11:30",
  "11:30-12:30",
  "12:30-1:00 (Lunch)",
  "1:00-2:00",
  "2:00-3:00",
];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const EditableTimeTable = () => {
  const [allTimetables, setAllTimetables] = useState({});
  const [semester, setSemester] = useState("3");
  const [division, setDivision] = useState("A");
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchTimetable();
    fetchSubjects();
    fetchFaculties();
  }, [semester, division]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/timetable/generate?semester=${semester}&division=${division}`
      );
      setAllTimetables((prev) => ({
        ...prev,
        [division]: res.data.timetable,
      }));
    } catch {
      setAllTimetables((prev) => ({
        ...prev,
        [division]: null,
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/subject/semester/${semester}`
    );
    setSubjects(res.data);
  };

  const fetchFaculties = async () => {
    const res = await axios.get("http://localhost:5000/api/faculty/all");
    setFaculties(res.data);
  };

  const handleCellClick = (day, slot) => {
    if (slot.includes("Lunch")) return;
    setEditingCell({ day, slot });
  };

  const assignFaculty = (div, day, slot, subjectName, facultyName) => {
    setAllTimetables((prev) => ({
      ...prev,
      [div]: {
        ...prev[div],
        [day]: {
          ...prev[div][day],
          [slot]: { subject: subjectName, faculty: facultyName },
        },
      },
    }));
  };

  const handleChangeLecture = async (subjectName) => {
    if (!editingCell) return;
    const { day, slot } = editingCell;

    const facultyForSubject = faculties.find((f) =>
      f.subjects.includes(subjectName)
    );
    const facultyName = facultyForSubject
      ? facultyForSubject.facultyName
      : "Not Assigned";

    const clashRes = await axios.post(
      "http://localhost:5000/api/timetable/checkFacultyClash",
      { facultyName, day, slot }
    );

    if (clashRes.data.clash) {
      setModalData({
        facultyName,
        subjectName,
        clashInfo: clashRes.data.clashInfo,
        newDay: day,
        newSlot: slot,
      });
    } else {
      assignFaculty(division, day, slot, subjectName, facultyName);
      saveSlot(day, slot, { subject: subjectName, faculty: facultyName });
    }

    setEditingCell(null);
  };

  const saveSlot = async (day, slot, lecture) => {
    try {
      await axios.patch("http://localhost:5000/api/timetable/updateSlot", {
        semester,
        division,
        day,
        slot,
        subject: lecture.subject,
        faculty: lecture.faculty,
      });
    } catch (err) {
      console.error(`Error saving slot ${day} ${slot}:`, err);
    }
  };

  const handleSave = async () => {
    if (!allTimetables[division]) return;

    try {
      const slotsToSave = [];
      weekdays.forEach((day) => {
        slots.forEach((slot) => {
          if (!slot.includes("Lunch")) {
            const lecture = allTimetables[division][day]?.[slot];
            if (lecture) {
              slotsToSave.push(saveSlot(day, slot, lecture));
            }
          }
        });
      });

      await Promise.all(slotsToSave);
      alert("✅ Timetable saved successfully!");
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("❌ Failed to save timetable. Try again.");
    }
  };

  const handleMoveFaculty = async () => {
    const { clashInfo, subjectName, facultyName, newDay, newSlot } = modalData;

    try {
      await axios.patch("http://localhost:5000/api/timetable/updateSlot", {
        semester: clashInfo.semester,
        division: clashInfo.division,
        day: clashInfo.day,
        slot: clashInfo.slot,
        subject: "",
        faculty: "-",
      });

      await axios.patch("http://localhost:5000/api/timetable/updateSlot", {
        semester,
        division,
        day: newDay,
        slot: newSlot,
        subject: subjectName,
        faculty: facultyName,
      });

      setAllTimetables((prev) => ({
        ...prev,
        [clashInfo.division]: {
          ...prev[clashInfo.division],
          [clashInfo.day]: {
            ...prev[clashInfo.day],
            [clashInfo.slot]: { subject: "", faculty: "-" },
          },
        },
        [division]: {
          ...prev[division],
          [newDay]: {
            ...prev[division][newDay],
            [newSlot]: { subject: subjectName, faculty: facultyName },
          },
        },
      }));

      setModalData(null);
      alert("✅ Faculty moved successfully!");
    } catch (err) {
      console.error("Error moving faculty:", err);
      alert("❌ Failed to move faculty. Try again.");
    }
  };

  const handleCancelMove = () => setModalData(null);

  // ---------------- Subject Colors (same as TimeTableView) ----------------
  const subjectColors = {};
  const getColor = (subject) => {
    if (!subject) return "#fff";
    if (!subjectColors[subject]) {
      const colors = [
        "#9B59B6",
        "#3498DB",
        "#E67E22",
        "#1ABC9C",
        "#FF6F61",
        "#F1C40F",
        "#8E44AD",
        "#00CED1",
      ];
      subjectColors[subject] =
        colors[Object.keys(subjectColors).length % colors.length];
    }
    return subjectColors[subject];
  };

  const timetableToRender = allTimetables[division];

  return (
    <div className="timetable-wrapper">
      <h2>Edit Weekly Timetable</h2>

      <div className="dropdown-row">
        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Division:
          <select value={division} onChange={(e) => setDivision(e.target.value)}>
            {["A", "B"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading timetable...</p>
      ) : !timetableToRender ? (
        <p>No timetable found.</p>
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
                  const lecture = timetableToRender[day]?.[slot];
                  const isEditing =
                    editingCell?.day === day && editingCell?.slot === slot;
                  return (
                    <td
                      key={day}
                      style={{ backgroundColor: getColor(lecture?.subject) }}
                      onClick={() => handleCellClick(day, slot)}
                    >
                      {isEditing ? (
                        <select
                          onChange={(e) => handleChangeLecture(e.target.value)}
                          value={lecture?.subject || ""}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((s) => (
                            <option key={s.subjectName} value={s.subjectName}>
                              {s.subjectName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <strong style={{ color: "#000" }}>
                            {lecture?.subject || ""}
                          </strong>
                          <br />
                          <small>{lecture?.faculty || ""}</small>
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

      <button className="save-timetable-btn" onClick={handleSave}>
        Save Changes
      </button>

      {modalData && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Faculty Already Assigned</h3>
            <p>
              <strong>{modalData.facultyName}</strong> is already teaching in{" "}
              <b>
                Sem {modalData.clashInfo.semester} {modalData.clashInfo.division}
              </b>{" "}
              on {modalData.clashInfo.day} ({modalData.clashInfo.slot}).
            </p>
            <p>Do you want to move them to this slot instead?</p>
            <div className="modal-buttons">
              <button className="move-btn" onClick={handleMoveFaculty}>
                Move Faculty
              </button>
              <button className="cancel-btn" onClick={handleCancelMove}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTimeTable;
