import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";


import SubjectForm from "./pages/SubjectForm"; // ✅ new import
import TimeTableView from "./pages/TimeTableView";
import ViewFaculty from "./pages/ViewFaculty";


import "./styles/App.css";
import FacultyForm from "./pages/FacultyForm";

function App() {
  return (
    <Router>
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="sparkle"></div>
        ))}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          
          
          <Route path="/subjectForm" element={<SubjectForm />} /> {/* ✅ new route */}
          <Route path="/facultyForm" element={<FacultyForm />} />
          <Route path="/timeTableView" element={<TimeTableView />} />
          <Route path="/viewFaculty" element={<ViewFaculty />} />

        </Routes>
      </>
    </Router>
  );
}

export default App;
