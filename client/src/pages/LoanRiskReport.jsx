import React from "react";

export default function LoanRiskReport() {
  // Sample high-risk data
  const riskData = {
    income: "$45,000",
    age: 32,
    loan_amount: "$25,000",
    risk_score: 87,
    risk_level: "HIGH",
  };

  // ----------------- STYLES -----------------
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #fbfbff 40%, #f6f2ff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 60px",
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    color: "#1f2937",
  };

  const cardStyle = {
    maxWidth: "980px",
    width: "100%",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "42px 48px",
    boxShadow: "0 6px 30px rgba(18, 24, 40, 0.06)",
    textAlign: "center",
  };

  const title = {
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  const subtitle = {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "28px",
  };

  const warningIcon = {
    width: "86px",
    height: "86px",
    borderRadius: "50%",
    background: "#fff4e5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 22px",
  };

  const box = {
    textAlign: "left",
    background: "#f9f9ff",
    padding: "18px 20px",
    borderRadius: "12px",
    marginBottom: "22px",
    fontSize: "15px",
    color: "#374151",
  };

  const button = {
    display: "block",
    width: "100%",
    padding: "12px 28px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    background: "linear-gradient(90deg,#7aa5ff 0%, #caa0ff 100%)",
    marginTop: "16px",
  };

  if (riskData.risk_level !== "HIGH") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={title}>Loan Risk is Low</h1>
          <p style={subtitle}>This application can be processed normally.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={warningIcon}>
          {/* Exclamation icon */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17h.01"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
          </svg>
        </div>

        <h1 style={title}>High Loan Risk Detected!</h1>
        <p style={subtitle}>According to our AI model, this loan application is risky.</p>

        <div style={box}>
          <p><strong>Income:</strong> {riskData.income}</p>
          <p><strong>Age:</strong> {riskData.age}</p>
          <p><strong>Loan Amount:</strong> {riskData.loan_amount}</p>
          <p><strong>Risk Score:</strong> {riskData.risk_score}</p>
          <p><strong>Risk Level:</strong> {riskData.risk_level}</p>
        </div>

        <button style={button} onClick={() => alert("Please review the application carefully")}>
          Take Action
        </button>
      </div>
    </div>
  );
}
