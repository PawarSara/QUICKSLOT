import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";       // make sure 'L' matches your file
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTT from "./pages/CreateTT";
import ViewTT from "./pages/ViewTT";


import "./styles/App.css";

function App() {
  return (
    <Router>
      {/* Sparkle background layer */}
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
          <Route path="/viewTT" element={<ViewTT />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
