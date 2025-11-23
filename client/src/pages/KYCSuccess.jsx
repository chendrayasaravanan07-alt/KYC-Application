import React from "react";

export default function KYCSuccess() {
  // Sample data to display
  const data = {
    fullName: "Saravanan",
    dob: "01/01/2000",
    gender: "Male",
    address: "123, Sample Street, City, Country",
    idNumber: "KYC123456789",
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

  const successIcon = {
    width: "86px",
    height: "86px",
    borderRadius: "50%",
    background: "#eafff3",
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

  const label = { fontWeight: 600, marginBottom: "4px" };

  const btn = {
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

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={successIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={title}>KYC Verified Successfully!</h1>
        <p style={subtitle}>Your identity has been verified.</p>

        <div style={box}>
          <div style={label}>Full Name</div>
          <div>{data.fullName}</div>

          <div style={{ ...label, marginTop: "12px" }}>Date of Birth</div>
          <div>{data.dob}</div>

          <div style={{ ...label, marginTop: "12px" }}>Gender</div>
          <div>{data.gender}</div>

          <div style={{ ...label, marginTop: "12px" }}>Address</div>
          <div>{data.address}</div>

          <div style={{ ...label, marginTop: "12px" }}>Document Number</div>
          <div>{data.idNumber}</div>
        </div>

        <button style={btn} onClick={() => alert("Proceeding to Dashboard…")}>
          Continue
        </button>
      </div>
    </div>
  );
}
