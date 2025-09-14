import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    // ✅ Name validation
    if (!name.trim()) {
      formErrors.name = "Name is required.";
      isValid = false;
    }

    // ✅ Email validation
    if (!email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    // ✅ Password validation
    if (!password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    // ✅ Confirm Password validation
    if (confirmPassword !== password) {
      formErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(formErrors);
    setServerError("");

    if (isValid) {
      try {
        // ✅ Send data to backend
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.message || "Registration failed. Try again.");
          return;
        }

        console.log("✅ Registered:", data);

        // ✅ Redirect to login
        navigate("/login");
      } catch (err) {
        console.error("❌ Error:", err);
        setServerError("Server not reachable. Try again later.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">📝 Create an Account</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          
          {/* Name */}
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`register-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`register-input ${errors.email ? "error" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`register-input ${errors.password ? "error" : ""}`}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈 Hide" : "👁️ Show"}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`register-input ${errors.confirmPassword ? "error" : ""}`}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

          {/* Server Error */}
          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="login-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
