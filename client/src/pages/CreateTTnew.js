import React, { useState, useEffect } from "react";
import "../styles/CreateTT.css";

// Updated Mock data for subjects based on year for the Computer Department
const SUBJECT_DATA = {
  // SE (Second Year)
  "2": ["MCE", "DSGT", "AOA", "COA", "JAVA", "ED", "EM"],
  // TE (Third Year)
  "3": ["CN", "SE", "DWM", "IP", "TCS", "PCE-II"],
  // BE (Fourth Year)
  "4": ["ML", "DLOC-3 NLP", "ILOC-I(CSL)", "BDA", "DLOC-4 BC"],
};

// Department is now strictly limited to Computer Engineering
const DEPARTMENTS = ["Computer Engineering (COMP)"];
const YEARS = ["2", "3", "4"];
const DIVISIONS = ["A", "B"];

const CreateTT = () => {
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [division, setDivision] = useState(DIVISIONS[0]);
  const [lecturesPerDay, setLecturesPerDay] = useState(8);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState(null);

  // Helper to display readable year
  const getYearDisplay = (y) => {
    if (y === "2") return "2nd Year (SE)";
    if (y === "3") return "3rd Year (TE)";
    if (y === "4") return "4th Year (BE)";
    return "";
  };

  // Auto-load subjects when year changes
  useEffect(() => {
    const subjectsForYear = SUBJECT_DATA[year] || [];
    setSubjects((prevSubjects) => {
      const newSubjects = subjectsForYear.map((subjectName) => {
        const existingSubject = prevSubjects.find((s) => s.subject === subjectName);
        return (
          existingSubject || {
            subject: subjectName,
            faculty: "",
            lectures: 4, // Default
          }
        );
      });
      return newSubjects;
    });
  }, [year]);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = field === "lectures" ? Number(value) : value;
    setSubjects(updated);
  };

  // Custom message popup
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = subjects.every(
      (s) => s.faculty.trim() !== "" && s.lectures > 0
    );
    if (!isFormValid) {
      showMessage(
        "Please fill faculty names and valid lecture hours for all subjects.",
        "error"
      );
      return;
    }

    const timetableData = {
      department,
      year: getYearDisplay(year),
      division: `Division ${division}`,
      lecturesPerDay,
      subjects,
    };

    console.log("Timetable Generation Data Submitted:", timetableData);
    showMessage(
      `Configuration for ${department}, ${getYearDisplay(year)}, Division ${division} submitted!`,
      "success"
    );
  };

  const renderSelectors = () => (
    <div className="selector-group">
      {/* Department Selector */}
      <select
        className="login-input tt-select"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        disabled
      >
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Year Selector */}
      <select
        className="login-input tt-select"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {getYearDisplay(y)}
          </option>
        ))}
      </select>

      {/* Division Selector */}
      <select
        className="login-input tt-select"
        value={division}
        onChange={(e) => setDivision(e.target.value)}
      >
        {DIVISIONS.map((d) => (
          <option key={d} value={d}>
            Division {d}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="login-page">
      {message && (
        <div className={`message-box ${message.type}`}>{message.text}</div>
      )}

      <div className="login-card">
        <h2 className="login-title">Create Department Timetable</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {renderSelectors()}

          {subjects.length > 0 && (
            <>
              <div className="subject-header">
                Configuration for {department} | {getYearDisplay(year)} | Division{" "}
                {division}
              </div>

              <table className="tt-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Lectures/Week</th>
                    <th>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subj, index) => (
                    <tr key={subj.subject}>
                      <td>
                        <span className="subject-name-display">{subj.subject}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="login-input tt-lecture-input"
                          placeholder="Hours"
                          value={subj.lectures}
                          min="1"
                          max="10"
                          onChange={(e) =>
                            handleChange(index, "lectures", e.target.value)
                          }
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="login-input"
                          placeholder="Faculty Name"
                          value={subj.faculty}
                          onChange={(e) =>
                            handleChange(index, "faculty", e.target.value)
                          }
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="submit" className="login-button submit-tt-button">
                Submit Timetable Configuration
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateTT;
