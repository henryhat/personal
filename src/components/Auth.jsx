import React, { useState } from "react";
import logo from "../assets/logo.png";

// Utility: hash password (simple but better than plaintext)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getUsers = () => {
    const saved = localStorage.getItem("ifinance_users");
    return saved ? JSON.parse(saved) : {};
  };

  const saveUsers = (users) => {
    localStorage.setItem("ifinance_users", JSON.stringify(users));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = getUsers();
    const key = username.trim().toLowerCase();

    if (users[key]) {
      setError("That username is already taken.");
      return;
    }

    users[key] = {
      username: username.trim(),
      password: hashPassword(password),
    };
    saveUsers(users);
    setSuccess("Account created! You can now log in.");
    setMode("login");
    setPassword("");
    setConfirmPassword("");
    localStorage.setItem(
      "ifinance_session",
      JSON.stringify({ username: username.trim() }),
    );
    onLogin(username.trim());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = getUsers();
    const key = username.trim().toLowerCase();
    const user = users[key];

    if (!user || user.password !== hashPassword(password)) {
      setError("Incorrect username or password.");
      return;
    }

    // Store active session
    localStorage.setItem(
      "ifinance_session",
      JSON.stringify({ username: user.username }),
    );
    onLogin(user.username);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem 1rem",
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
          background: "#fff",
        }}
      >
        <img
          src={logo}
          style={{ width: "120px", height: "96px", margin: "auto" }}
          alt="iFINANCE"
        />
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          Personal Finance Tracker
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            {/* Tab switcher */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchMode(tab)}
                  style={{
                    padding: "14px",
                    fontSize: "13px",
                    fontWeight: "500",
                    background: mode === tab ? "#fff" : "#f9f9f9",
                    border: "none",
                    borderBottom:
                      mode === tab
                        ? "2px solid #007AFF"
                        : "2px solid transparent",
                    cursor: "pointer",
                    color: mode === tab ? "#007AFF" : "#888",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {tab === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ padding: "1.75rem" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0 0 0.25rem",
                  color: "#333",
                }}
              >
                {mode === "login" ? "Welcome back" : "Create an account"}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#888",
                  margin: "0 0 1.5rem",
                }}
              >
                {mode === "login"
                  ? "Log in to continue tracking your finances."
                  : "Sign up to start managing your income and expenses."}
              </p>

              {/* Success message */}
              {success && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#eafaf1",
                    border: "1px solid #a9dfbf",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    fontSize: "13px",
                    color: "#1e8449",
                  }}
                >
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#fdf3f2",
                    border: "1px solid #f5c6c2",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    fontSize: "13px",
                    color: "#c0392b",
                  }}
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={mode === "login" ? handleLogin : handleSignup}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Username */}
                <div>
                  <label style={labelStyle}>Username</label>
                  <input
                    type="text"
                    placeholder="e.g. john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      style={{ ...inputStyle, paddingRight: "42px" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#aaa",
                        padding: "2px",
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (signup only) */}
                {mode === "signup" && (
                  <div>
                    <label style={labelStyle}>Confirm password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      style={inputStyle}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "11px",
                    fontSize: "15px",
                    fontWeight: "500",
                    background: "#007AFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "4px",
                  }}
                >
                  {mode === "login" ? "Log in" : "Create account"}
                </button>
              </form>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "1.25rem",
                  marginBottom: 0,
                }}
              >
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() =>
                    switchMode(mode === "login" ? "signup" : "login")
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007AFF",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: 0,
                    fontWeight: "500",
                  }}
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem 1rem",
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          iFINANCE © 2026 — Your Personal Finance Tracker
        </p>
      </div>
    </div>
  );
}
