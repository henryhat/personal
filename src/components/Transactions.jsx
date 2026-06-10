import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function iFINANCE({ username, onLogout }) {
  const formatMoney = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("ifinance_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [startingBalance, setStartingBalance] = useState(() => {
    const saved = localStorage.getItem("ifinance_balance");
    return saved ? parseFloat(saved) : 0;
  });

  const [inputStartingBalance, setInputStartingBalance] =
    useState(startingBalance);
  const [balanceSet, setBalanceSet] = useState(startingBalance > 0);

  // Income form
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeDate, setIncomeDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Expenses form
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [filter, setFilter] = useState("All");

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Health",
    "Bills",
    "Education",
    "Other",
  ];

  useEffect(() => {
    localStorage.setItem("ifinance_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("ifinance_balance", startingBalance.toString());
  }, [startingBalance]);

  const setInitialBalance = (e) => {
    e.preventDefault();
    if (inputStartingBalance >= 0) {
      setStartingBalance(inputStartingBalance);
      setBalanceSet(true);
    }
  };

  const addIncome = (e) => {
    e.preventDefault();
    if (!incomeAmount || !incomeDescription) return;

    const newTransaction = {
      id: Date.now(),
      type: "income",
      amount: parseFloat(incomeAmount),
      description: incomeDescription,
      date: incomeDate,
      category: "Salary",
    };

    setTransactions([newTransaction, ...transactions]);
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeDate(new Date().toISOString().split("T")[0]);
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDescription) return;

    const newTransaction = {
      id: Date.now(),
      type: "expense",
      amount: parseFloat(expenseAmount),
      description: expenseDescription,
      date: expenseDate,
      category: expenseCategory,
    };

    setTransactions([newTransaction, ...transactions]);
    setExpenseAmount("");
    setExpenseDescription("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = startingBalance + totalIncome - totalExpenses;

  const filteredTransactions =
    filter === "All"
      ? transactions
      : filter === "Income"
        ? transactions.filter((t) => t.type === "income")
        : transactions.filter(
            (t) => t.type === "expense" && t.category === filter,
          );

  if (!balanceSet) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <div
          style={{
            padding: "1.5rem 1rem",
            textAlign: "center",
            borderBottom: "1px solid #e0e0e0",
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

        <div style={{ padding: "2rem 1rem", maxWidth: "100%" }}>
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  textAlign: "center",
                  color: "#333",
                }}
              >
                Welcome to iFINANCE
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                Set your starting balance to begin tracking your income and
                expenses
              </p>
              <form
                onSubmit={setInitialBalance}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter starting balance (₦)"
                  value={inputStartingBalance}
                  onChange={(e) =>
                    setInputStartingBalance(parseFloat(e.target.value) || 0)
                  }
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    fontWeight: "500",
                    padding: "12px",
                    fontSize: "16px",
                    background: "#007AFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Start tracking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* ── Navbar ── */}
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            style={{ width: "120px", height: "96px" }}
            alt="iFINANCE"
          />

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Greeting */}
            <span style={{ fontSize: "13px", color: "#555" }}>
              👋 Good day, <strong>{username}</strong>
            </span>

            {/* Reset */}
            <button
              onClick={() => {
                if (window.confirm("Reset all data? This cannot be undone.")) {
                  setTransactions([]);
                  setStartingBalance(0);
                  setInputStartingBalance(0);
                  setBalanceSet(false);
                  localStorage.removeItem("ifinance_transactions");
                  localStorage.removeItem("ifinance_balance");
                }
              }}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                backgroundColor: "green",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                color: "white",
              }}
              title="Reset all data"
            >
              Reset
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                backgroundColor: "#e74c3c",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                color: "white",
              }}
              title="Log out"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 1rem 1rem", maxWidth: "100%" }}>
        {/* Balance Summary */}
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "1.5rem",
            padding: "1.5rem",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              margin: "0 0 8px",
              fontWeight: "500",
            }}
          >
            Available balance
          </p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: "500",
              margin: "0 0 1.5rem",
              color: currentBalance >= 0 ? "#333" : "#e74c3c",
            }}
          >
            ₦{formatMoney(currentBalance)}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#888",
                  margin: "0 0 6px",
                  fontWeight: "500",
                }}
              >
                Total income
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: 0,
                  color: "#27ae60",
                }}
              >
                +₦{formatMoney(totalIncome)}
              </p>
            </div>
            <div
              style={{
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#888",
                  margin: "0 0 6px",
                  fontWeight: "500",
                }}
              >
                Total expenses
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: 0,
                  color: "#e74c3c",
                }}
              >
                -₦{formatMoney(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Income Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "500",
              margin: "0 0 0.75rem",
              color: "#333",
            }}
          >
            INCOME
          </h2>
          <form
            onSubmit={addIncome}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "1rem",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Description (e.g., Monthly salary)"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                fontWeight: "500",
                padding: "10px",
                background: "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add income
            </button>
          </form>
        </div>

        {/* Expense Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "500",
              margin: "0 0 0.75rem",
              color: "#333",
            }}
          >
            EXPENSES
          </h2>
          <form
            onSubmit={addExpense}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "1rem",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description (e.g., Lunch)"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                fontWeight: "500",
                padding: "10px",
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add expense
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "500",
              margin: "0 0 0.75rem",
              color: "#333",
            }}
          >
            TRANSACTIONS
          </h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            {["All", "Income", ...categories].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: filter === filterType ? "500" : "400",
                  background: filter === filterType ? "#007AFF" : "#f0f0f0",
                  border:
                    filter === filterType
                      ? "1px solid #007AFF"
                      : "1px solid #ddd",
                  cursor: "pointer",
                  color: filter === filterType ? "#fff" : "#333",
                  transition: "all 0.2s",
                }}
              >
                {filterType}
              </button>
            ))}
          </div>

          {filteredTransactions.length === 0 ? (
            <div
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                background: "#fff",
                borderRadius: "8px",
                border: "1px dashed #ddd",
              }}
            >
              <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>
                No transactions yet. Add your first income or expense.
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {filteredTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      borderLeft: `4px solid ${transaction.type === "income" ? "#27ae60" : "#e74c3c"}`,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: "500",
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          {transaction.description}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          color: "#888",
                        }}
                      >
                        <span>{transaction.category}</span>
                        <span>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          color:
                            transaction.type === "income"
                              ? "#27ae60"
                              : "#e74c3c",
                          minWidth: "80px",
                          textAlign: "right",
                        }}
                      >
                        {transaction.type === "income" ? "+" : "-"}₦
                        {formatMoney(transaction.amount)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ccc",
                          fontSize: "16px",
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem 1rem",
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
          marginTop: "2rem",
        }}
      >
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          iFINANCE © 2026 — Your Personal Finance Tracker
        </p>
      </div>
    </div>
  );
}
