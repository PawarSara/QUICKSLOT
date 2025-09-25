import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTT from "./pages/CreateTT";

import "./styles/App.css"; // general app styling

function App() {
  return (
    <Router>
      {/* Sparkle background layer — fixed behind everything */}
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="sparkle"></div>
        ))}

        {/* Main app content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/createTT" element={<CreateTT />} />

        </Routes>
      </>
    </Router>
  );
}

export default App;
