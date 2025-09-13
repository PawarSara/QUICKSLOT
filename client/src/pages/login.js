import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = { email: "", password: "" };
    let isValid = true;

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
      else if (password.length > 6) {
        formErrors.password = "Password must be less than 6 characters long.";
        isValid = false;
    }

    setErrors(formErrors);

    if (isValid) {
      console.log("✅ Form submitted:", { email, password });
      // 👉 Here you would call your backend API
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">🔑 Login to QuickSlot</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`login-input ${errors.email ? "error" : ""}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`login-input ${errors.password ? "error" : ""}`}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="signup-text">
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
