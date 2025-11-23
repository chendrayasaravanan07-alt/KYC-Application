import React from "react";
import ReactDOM from "react-dom/client";

export default function ErrorPage({ reason }) {
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg,#ffffff 0%,#fbfbff 40%,#f6f2ff 100%)",
      padding: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, Roboto, Arial, sans-serif",
    },
    card: {
      width: "650px",
      background: "#ffffff",
      borderRadius: "12px",
      padding: "40px",
      boxShadow: "0 6px 30px rgba(18, 24, 40, 0.06)",
      textAlign: "center",
    },
    title: {
      fontSize: "30px",
      fontWeight: 700,
      marginBottom: "10px",
      color: "#1e3a8a",
    },
    subtitle: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "25px",
    },
    iconWrap: {
      width: "86px",
      height: "86px",
      borderRadius: "50%",
      background: "linear-gradient(180deg,#e0e7ff,#f0f4ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto 22px",
    },
    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      fontWeight: 600,
      color: "white",
      cursor: "pointer",
      background: "linear-gradient(90deg,#7aa5ff 0%, #caa0ff 100%)",
      fontSize: "16px",
      marginTop: "16px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#1e3a8a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={styles.title}>Face Verification Failed</h1>
        <p style={styles.subtitle}>
          {reason || "The face on the document does not match the selfie."}
        </p>
        <button style={styles.button} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );
}

// -------- Test the component --------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ErrorPage reason="No face detected in the selfie." />);
