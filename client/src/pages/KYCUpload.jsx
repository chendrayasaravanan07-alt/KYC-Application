import React, { useState } from "react";

export default function KYCUploads() {
  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handleUpload = (e, setter) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const handleClear = (setter) => setter(null);

  const disabled = !idFile || !addressFile || !photoFile;

  // Inline styles to match the screenshot exactly
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #fbfbff 40%, #f6f2ff 100%)",
    padding: "40px 60px",
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    color: "#1f2937",
  };

  const cardStyle = {
    maxWidth: "980px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "42px 48px",
    boxShadow: "0 6px 30px rgba(18, 24, 40, 0.06)",
  };

  const title = {
    fontSize: "32px",
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  };

  const subtitle = {
    textAlign: "center",
    color: "#6b7280",
    marginTop: "8px",
    marginBottom: "28px",
    fontSize: "14px",
  };

  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px",
    borderRadius: "8px",
    border: "2px dashed #e6e6e6",
    marginBottom: "22px",
    gap: "16px",
  };

  const left = { display: "flex", alignItems: "center", gap: "16px" };
  const iconWrap = {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const label = { fontSize: "16px", marginBottom: "6px" };
  const small = { fontSize: "13px", color: "#6b7280", margin: 0 };

  const actionBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e6e6e6",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  };

  const continueBtn = {
    margin: "28px auto 8px",
    display: "block",
    padding: "12px 28px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg,#7aa5ff 0%, #caa0ff 100%)",
    color: "white",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };

  const hint = { textAlign: "center", color: "#9ca3af", marginTop: "8px" };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={title}>Upload Your Documents</h1>
        <p style={subtitle}>AI will automatically extract and verify your information</p>

        {/* ID Proof row */}
        <div style={row}>
          <div style={left}>
            <div style={{ ...iconWrap, background: "linear-gradient(180deg,#e8f0ff,#f6f9ff)" }}>
              {/* ID SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2b6cff" strokeWidth="1.2" fill="#ffffff" />
                <path d="M8 8h8" stroke="#2b6cff" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M8 12h8" stroke="#2b6cff" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M8 16h5" stroke="#2b6cff" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={label}>ID Proof (Aadhaar/PAN/Passport)</div>
              <p style={small}>{idFile ? idFile.name : "No file selected"}</p>
            </div>
          </div>

          <label style={actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v9" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12l7-7 7 7" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21H3" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
            <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e, setIdFile)} />
          </label>
        </div>

        {/* Address Proof row */}
        <div style={row}>
          <div style={left}>
            <div style={{ ...iconWrap, background: "linear-gradient(180deg,#f6ecff,#fff6ff)" }}>
              {/* Home SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10.5L12 4l9 6.5" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 21V11h14v10" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={label}>Address Proof (Utility Bill/Bank Statement)</div>
              <p style={small}>{addressFile ? addressFile.name : "No file selected"}</p>
            </div>
          </div>

          <label style={actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v9" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12l7-7 7 7" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21H3" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
            <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e, setAddressFile)} />
          </label>
        </div>

        {/* Photo row */}
        <div style={row}>
          <div style={left}>
            <div style={{ ...iconWrap, background: "linear-gradient(180deg,#e9ffef,#f8fff9)" }}>
              {/* Camera SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="3" stroke="#10b981" strokeWidth="1.4" fill="#ffffff"/>
                <path d="M8 6l1.5-2h5L16 6" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="3" stroke="#10b981" strokeWidth="1.4"/>
              </svg>
            </div>
            <div>
              <div style={label}>Your Photo</div>
              <p style={small}>{photoFile ? photoFile.name : "No file selected"}</p>
            </div>
          </div>

          <label style={actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v9" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12l7-7 7 7" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21H3" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Capture
            <input type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={(e) => handleUpload(e, setPhotoFile)} />
          </label>
        </div>

        <button style={continueBtn} disabled={disabled} onClick={() => alert('Continue clicked')}>
          Continue to Verification
        </button>

        <p style={hint}>Please upload all three documents to continue</p>
      </div>
    </div>
  );
}
