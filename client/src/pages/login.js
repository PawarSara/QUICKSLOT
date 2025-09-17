import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

    setErrors(formErrors);
    setServerError("");

    if (isValid) {
      try {
        // ✅ API request to backend
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.message || "Login failed. Try again.");
          return;
        }

        // ✅ Save token
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        console.log("✅ Logged in:", data);

        // ✅ Redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Error:", err);
        setServerError("Server not reachable. Make sure backend is running.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
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
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`login-input ${errors.password ? "error" : ""}`}
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

          {/* Remember Me */}
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>

          {/* Server Error */}
          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
