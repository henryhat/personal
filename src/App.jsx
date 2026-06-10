import React, { useState } from "react";
import Transactions from "./components/Transactions";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("ifinance_session");
    return session ? JSON.parse(session).username : null;
  });

  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogin = (username) => {
    localStorage.setItem("ifinance_session", JSON.stringify({ username }));
    setUser(username);
    setShowWelcome(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("ifinance_session");
    setUser(null);
    setShowWelcome(false);
  };

  // Not logged in — show Auth
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Just logged in / signed up — show Welcome screen
  if (showWelcome) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "2.5rem 2rem",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>👋</div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#333",
              margin: "0 0 0.5rem",
            }}
          >
            Welcome, {user}!
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              margin: "0 0 2rem",
              lineHeight: "1.5",
            }}
          >
            Your personal finance dashboard is ready. Start tracking your income
            and expenses.
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              fontWeight: "500",
              background: "#007AFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go to Dashboard →
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#bbb", marginTop: "2rem" }}>
          iFINANCE © 2025 — Your Personal Finance Tracker
        </p>
      </div>
    );
  }

  // Logged in — show main app
  return <Transactions username={user} onLogout={handleLogout} />;
}
