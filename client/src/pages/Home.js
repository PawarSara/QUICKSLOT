import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { FaClock, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { GiBookshelf, GiScissors } from "react-icons/gi";

function Home() {
  return (
    <div className="home-container">

      {/* Background thematic icons */}
      <GiBookshelf className="bg-icon icon1"/>
      <GiScissors className="bg-icon icon2"/>
      <FaCalendarAlt className="bg-icon icon3"/>
      <FaClock className="bg-icon icon4"/>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">📅 QuickSlot</h1>
        <p className="hero-tagline">Smartly plan your day. Save your time.</p>
        <div className="hero-buttons">
          <Link to="/login" className="button">
            🔑 Login
          </Link>
          <Link to="/register" className="button">
            📝 Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <FaClock className="feature-icon"/>
            <h3>Smart Scheduling</h3>
            <p>Automatically arrange your timetable without conflicts.</p>
          </div>
          <div className="feature-card">
            <FaCalendarAlt className="feature-icon"/>
            <h3>Conflict-Free Planning</h3>
            <p>Ensure no overlapping tasks or subjects in your day.</p>
          </div>
          <div className="feature-card">
            <FaCheckCircle className="feature-icon"/>
            <h3>Progress Tracking</h3>
            <p>Keep track of completed tasks and your study goals.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Enter Subjects</h3>
            <p>Add your subjects with timings and priorities.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Generate Timetable</h3>
            <p>QuickSlot automatically creates your optimized schedule.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Save & Export</h3>
            <p>Save your timetable and access it anytime.</p>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips">
        <h2>Tips for Effective Timetable Planning</h2>
        <div className="tips-container">
          <div className="tip-bubble">Prioritize difficult subjects first.</div>
          <div className="tip-bubble">Include short breaks between sessions.</div>
          <div className="tip-bubble">Review and adjust weekly.</div>
          <div className="tip-bubble">Mix theory and practical subjects.</div>
          <div className="tip-bubble">Keep timetable flexible for surprises.</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Plan smarter. Study better. Save time.</p>
        <p>© 2025 QuickSlot | Contact: info@quickslot.com</p>
      </footer>
    </div>
  );
}

export default Home;
