import React, { useEffect, useState } from "react";

export default function AutoFillForm({ idFile, addressFile }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    idNumber: "",
  });

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
      marginBottom: "10px",
    },
    subtitle: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "25px",
    },
    inputGroup: {
      marginBottom: "18px",
    },
    label: {
      fontWeight: "600",
      fontSize: "15px",
      display: "block",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
      fontSize: "15px",
      outline: "none",
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
      fontSize: "16px",
    },
    loading: {
      textAlign: "center",
      color: "#6b7280",
      marginBottom: "15px",
    },
  };

  // ---------- OCR FUNCTION ----------
  const extractText = async (file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/extract-text", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.text || "";
  };

  // ---------- AUTO-FILL LOGIC ----------
  const parseExtractedText = (text) => {
    const extracted = { ...formData };

    // Rough extraction examples — adjust based on your OCR output
    const nameMatch = text.match(/Name[:\-]?\s*(.*)/i);
    const dobMatch = text.match(/DOB[:\-]?\s*([0-9\/\-]+)/i);
    const genderMatch = text.match(/Gender[:\-]?\s*(Male|Female|Other)/i);
    const idMatch = text.match(/(Aadhaar|ID|PAN|Passport)[:\-]?\s*([A-Z0-9]+)/i);

    if (nameMatch) extracted.fullName = nameMatch[1].trim();
    if (dobMatch) extracted.dob = dobMatch[1].trim();
    if (genderMatch) extracted.gender = genderMatch[1].trim();
    if (idMatch) extracted.idNumber = idMatch[2].trim();

    // Example address extraction
    const addressMatch = text.match(/Address[:\-]?\s*([\s\S]*)/i);
    if (addressMatch) extracted.address = addressMatch[1].split("\n")[0].trim();

    return extracted;
  };

  // ---------- RUN OCR WHEN FILES ARRIVE ----------
  useEffect(() => {
    const processFiles = async () => {
      if (!idFile && !addressFile) return;

      setLoading(true);

      let combinedText = "";

      if (idFile) combinedText += await extractText(idFile);
      if (addressFile) combinedText += "\n" + (await extractText(addressFile));

      const parsedData = parseExtractedText(combinedText);
      setFormData(parsedData);

      setLoading(false);
    };

    processFiles();
  }, [idFile, addressFile]);

  // ---------- HANDLE INPUT CHANGE ----------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Auto-Filled KYC Details</h2>
        <p style={styles.subtitle}>Extracted automatically from your uploaded documents</p>

        {loading && <p style={styles.loading}>Extracting details from documents…</p>}

        {/* FULL NAME */}
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

        {/* DOB */}
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

        {/* GENDER */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Gender</label>
          <input
            style={styles.input}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Male / Female / Other"
          />
        </div>

        {/* ADDRESS */}
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

        {/* ID NUMBER */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>ID Number</label>
          <input
            style={styles.input}
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="Aadhaar/PAN/Passport Number"
          />
        </div>

        <button style={styles.button}>Submit Verification</button>
      </div>
    </div>
  );
}
