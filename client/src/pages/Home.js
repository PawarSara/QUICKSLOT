import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaLightbulb } from "react-icons/fa";
import "../styles/Home.css";

function Home() {
  // useEffect hook to handle the scroll-reveal logic after component mounts
  useEffect(() => {
    const sections = document.querySelectorAll('.section-container');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          // Optional: remove class when out of view
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      threshold: 0.1 // Triggers when 10% of the section is visible
    });

    sections.forEach(section => {
      observer.observe(section);
    });

    // Clean up the observer when the component unmounts
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="home">
      {/* Background Elements - These will be styled in CSS */}
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
      <section className="hero section-container">
        <div className="hero-text">
          <motion.h1 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Smart Timetable Management
          </motion.h1>
          <p>
            Plan smarter. Save time. Boost productivity.
            Our system makes managing your schedule effortless.
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
          <img src="https://dummyimage.com/500x350/6b00b3/ffffff&text=Timetable+Preview" alt="Preview"/>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features section-container">
        <h2>Features</h2>
        <div className="feature-cards">
          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaCalendarAlt className="feature-icon"/>
            <h3>Easy Scheduling</h3>
            <p>Create and edit timetables effortlessly with our user-friendly interface.</p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaClock className="feature-icon"/>
            <h3>Time Optimization</h3>
            <p>Get suggestions on how to maximize efficiency and minimize clashes.</p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
            <FaLightbulb className="feature-icon"/>
            <h3>Smart Reminders</h3>
            <p>Stay on track with AI-powered reminders for tasks and classes.</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works section-container">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Register</h4>
            <p>Sign up and set up your profile in minutes.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Create</h4>
            <p>Build your custom timetable with just a few clicks.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Optimize</h4>
            <p>Let the system suggest the best schedule for you.</p>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips section-container">
  <h2>Productivity Tips</h2>
  <div className="tips-container">
    <div className="tip">Break large tasks into smaller ones.</div>
    <div className="tip">Use the 25–5 Pomodoro technique.</div>
    <div className="tip">Prioritize high-impact work first.</div>
    <div className="tip">Review your schedule every week.</div>
    <div className="tip">Balance work with short breaks.</div>
    <div className="tip">Time-block your schedule to stay on track.</div>
    <div className="tip">Eliminate distractions by turning off notifications.</div>
    <div className="tip">Start your day with a clear plan.</div>
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