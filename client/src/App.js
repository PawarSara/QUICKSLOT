import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTT from "./pages/CreateTT";
import ViewTT from "./pages/ViewTT";
import SubjectForm from "./pages/SubjectForm"; // ✅ new import

import "./styles/App.css";

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
          <Route path="/createTT" element={<CreateTT />} />
          <Route path="/viewTT" element={<ViewTT />} />
          <Route path="/subjectForm" element={<SubjectForm />} /> {/* ✅ new route */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
