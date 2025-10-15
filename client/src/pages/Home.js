import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaLightbulb } from "react-icons/fa";
import SIGCEpreview from "../assets/SIGCEpreview.png";
import "../styles/Home.css";

function Home() {
  // useEffect hook to handle the scroll-reveal logic after component mounts
  useEffect(() => {
    const sections = document.querySelectorAll(".section-container");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            // Optional: remove class when out of view
            entry.target.classList.remove("in-view");
          }
        });
      },
      {
        threshold: 0.1, // Triggers when 10% of the section is visible
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    // Clean up the observer when the component unmounts
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="home">
      {/* Background Elements */}
      <div className="background-glow top-left"></div>
      <div className="background-glow bottom-right"></div>
      <div className="background-glow center-top"></div>
      <div className="background-glow middle-left"></div>
      <div className="background-glow bottom-left-2"></div>

      <div className="background-pattern pattern-one"></div>
      <div className="background-pattern pattern-two"></div>
      <div className="background-pattern pattern-three"></div>
      <div className="background-pattern pattern-four"></div>
      {/* End Background Elements */}

      {/* Hero Section */}
      {/* Hero Section */}
<section className="hero section-container">
  <div className="hero-text">
    <motion.h1
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span className="brand">QUICKSLOT<br/></span>
      <span className="subtitle">A smart timetable generator</span>
    </motion.h1>

    <p>
      QuickSlot is an intelligent timetable generator designed
      exclusively for the <strong>Computer Department</strong>.
      Streamline scheduling across all years with accuracy, speed, and zero conflicts.
    </p>

    <div className="hero-buttons">
      <Link to="/login" className="btn-primary">
        Login
      </Link>
    </div>
  </div>

  <motion.div
    className="hero-image"
    initial={{ opacity: 0, x: 80 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
  >
    <img
      src={SIGCEpreview}
      alt="Timetable Preview"
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "auto",
        borderRadius: "15px",
      }}
    />
  </motion.div>
</section>


      {/* Features Section */}
      <section className="features section-container">
        <h2>Key Features of QuickSlot</h2>
        <div className="feature-cards">
          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaCalendarAlt className="feature-icon" />
            <h3>Smart Scheduling</h3>
            <p>
              Automatically generate organized timetables for all classes and
              faculty in the Computer Department.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaClock className="feature-icon" />
            <h3>Time Optimization</h3>
            <p>
              Detect and resolve timing conflicts while balancing workload
              across faculty members.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaLightbulb className="feature-icon" />
            <h3>Multi-Year Management</h3>
            <p>
              Generate synchronized timetables for multiple years without any
              overlapping sessions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works section-container">
        <h2>How QuickSlot Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Login</h4>
            <p>
              Sign in securely and access your Computer Department dashboard.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Create</h4>
            <p>
              Add faculty, subjects, and classrooms to build your department’s
              timetable effortlessly.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Optimize</h4>
            <p>
              Let QuickSlot automatically detect and fix conflicts to generate
              the most efficient schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="tips section-container">
        <h2>Why Choose QuickSlot</h2>
        <div className="tips-container">
          <div className="tip">
            Designed specifically for the Computer Department’s scheduling
            needs.
          </div>
          <div className="tip">
            Eliminates manual timetable creation and reduces human workload.
          </div>
          <div className="tip">
            Saves hours of planning by auto-generating accurate timetables.
          </div>
          <div className="tip">
            Prevents class, room, and faculty conflicts automatically.
          </div>
      
          <div className="tip">
            Balances faculty workload across all semesters efficiently.
          </div>
          <div className="tip">
            Provides clean, printable, and shareable timetable reports.
          </div>
          <div className="tip">
            Improves coordination between faculty, classrooms, and subjects.
          </div>
          <div className="tip">
            Boosts departmental productivity with automation and clarity.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          QuickSlot – The Smart Timetable Generator for the Computer Department.
        </p>
        <p>© 2025 QuickSlot | Department Timetable Management System</p>
      </footer>
    </div>
  );
}

export default Home;
