import React, { useState } from "react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "हिंदी", native: "Hindi" },
  { code: "ta", label: "தமிழ்", native: "Tamil" },
  { code: "te", label: "తెలుగు", native: "Telugu" },
  { code: "kn", label: "ಕನ್ನಡ", native: "Kannada" },
  { code: "ml", label: "മലയാളം", native: "Malayalam" },
  { code: "bn", label: "বাংলা", native: "Bengali" },
  { code: "mr", label: "मराठी", native: "Marathi" },
  { code: "gu", label: "ગુજરાતી", native: "Gujarati" },
  { code: "pa", label: "ਪੰਜਾਬੀ", native: "Punjabi" },
];

export default function Language() {
  const [selected, setSelected] = useState("en");

  const handleSelect = (code) => {
    setSelected(code);
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    color: "gray",
    marginBottom: "30px",
    fontSize: "15px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    padding: "0 20px",
  };

  const buttonStyle = (code) => ({
    padding: "20px",
    width: "150px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: selected === code ? "#000" : "#fff",
    color: selected === code ? "#fff" : "#000",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "500",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
    transition: "0.3s",
    transform: selected === code ? "scale(1.07)" : "scale(1)",
  });

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Select Your Preferred Language</h1>
      <p style={subtitleStyle}>Choose the language for voice assistance and instructions</p>

      <div style={gridStyle}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={buttonStyle(lang.code)}
          >
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{lang.label}</div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>{lang.native}</div>
          </button>
        ))}
      </div>

      <p style={{ color: "gray", marginTop: "30px", fontSize: "14px" }}>
        You can change the language anytime during the process
      </p>
    </div>
  );
}
