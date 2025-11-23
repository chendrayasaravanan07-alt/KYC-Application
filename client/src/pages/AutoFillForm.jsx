import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AutoFillForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    idNumber: "",
  });

  const API_BASE_URL = "http://localhost:8000"; // Your FastAPI server

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #ffffff 0%, #fbfbff 40%, #f6f2ff 100%)",
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
    },
    title: { 
      textAlign: "center", 
      fontSize: "30px", 
      fontWeight: 700, 
      marginBottom: "10px" 
    },
    subtitle: { 
      textAlign: "center", 
      fontSize: "14px", 
      color: "#6b7280", 
      marginBottom: "25px" 
    },
    inputGroup: { 
      marginBottom: "18px" 
    },
    label: { 
      fontWeight: "600", 
      fontSize: "15px", 
      display: "block", 
      marginBottom: "6px" 
    },
    input: { 
      width: "100%", 
      padding: "12px", 
      borderRadius: "10px", 
      border: "1px solid #e5e7eb", 
      fontSize: "15px", 
      outline: "none",
      boxSizing: "border-box"
    },
    button: { 
      width: "100%", 
      padding: "14px", 
      marginTop: "20px", 
      borderRadius: "12px", 
      border: "none", 
      background: "linear-gradient(90deg,#7aa5ff 0%, #caa0ff 100%)", 
      color: "white", 
      fontWeight: 600, 
      cursor: "pointer", 
      fontSize: "16px" 
    },
    refreshButton: {
      width: "100%",
      padding: "12px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "2px solid #7aa5ff",
      background: "white",
      color: "#7aa5ff",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px"
    },
    loading: { 
      textAlign: "center", 
      color: "#6b7280", 
      marginBottom: "15px",
      fontSize: "14px"
    },
    error: {
      textAlign: "center",
      color: "#ef4444",
      marginBottom: "15px",
      fontSize: "14px",
      padding: "10px",
      background: "#fee2e2",
      borderRadius: "8px"
    },
    recordInfo: {
      background: "#f3f4f6",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "13px",
      color: "#4b5563"
    }
  };

  // ---------- FETCH DATA FROM API ----------
  const fetchLatestKYCData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the latest record from FastAPI
      const response = await axios.get(`${API_BASE_URL}/latest`);
      const data = response.data;

      if (data && data.extracted_details) {
        const details = data.extracted_details;
        
        setFormData({
          fullName: details.name || "",
          dob: details.dob || "",
          gender: details.gender || "",
          address: details.address || "",
          idNumber: details.aadhar_number || "",
        });
      }
    } catch (err) {
      console.error("Failed to load KYC data:", err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestKYCData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted KYC data:", formData);
    alert("KYC Details Submitted Successfully!");
    // Add your submission logic here
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Auto-Filled KYC Details</h2>
        <p style={styles.subtitle}>
          Extracted automatically from your uploaded documents
        </p>

        {/* Refresh Button */}
        <button 
          style={styles.refreshButton}
          onClick={fetchLatestKYCData}
          disabled={loading}
        >
          {loading ? "Loading..." : "🔄 Refresh Latest Data"}
        </button>

        {/* Loading State */}
        {loading && <p style={styles.loading}>Loading extracted details…</p>}

        {/* Error State */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              style={styles.input}
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select
              style={styles.input}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Address</label>
            <input
              style={styles.input}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ID Number (Aadhaar)</label>
            <input
              style={styles.input}
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Aadhaar/PAN/Passport Number"
            />
          </div>

          <button type="submit" style={styles.button}>
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  );
}
