import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [assistantVisible, setAssistantVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Prevent black background
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#f5f8ff";
    document.documentElement.style.margin = "0";

   

  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;

    msg.onstart = () => setIsSpeaking(true);
    msg.onend = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // avoid overlapping audio
    window.speechSynthesis.speak(msg);
  };

  // Auto speak when assistant box appears
  useEffect(() => {
    if (assistantVisible) {
      speak(
        "Welcome to AI-powered KYC verification. Let me guide you through this process."
      );
    }
  }, [assistantVisible]);

  // 🔥 Force auto-speech when page loads
  useEffect(() => {
    setTimeout(() => {
      speak(
        "Welcome to AI-powered KYC verification. Let me guide you through this process."
      );
    }, 500);
  }, []);

  const styles = {
    page: {
      height: "100vh",         // full screen height
      width: "100vw",
      overflow: "hidden",      // 🚀 stop scrolling
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "radial-gradient(circle at top left, #e9f1ff 0%, transparent 60%), radial-gradient(circle at bottom right, #f9eaff 0%, transparent 60%), #f5f8ff",
    },


    card: {
      width: "90%",
      maxWidth: "900px",
      background: "#fff",
      borderRadius: "18px",
      padding: "40px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      textAlign: "center"
    },

    headerGradient: {
      width: "100%",
      height: "80px",
      borderRadius: "50px",
      background: "linear-gradient(90deg, #5c6bff, #b44aff)",
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      marginBottom: "30px"
    },

    logo: {
      height: "55px",
      borderRadius: "12px"
    },

    title: {
      fontSize: "38px",
      fontWeight: "700",
      color: "#5a41dd",
      marginBottom: "10px"
    },

    subtitle: {
      fontSize: "17px",
      color: "#6f6f7f",
      maxWidth: "600px",
      margin: "0 auto 40px auto"
    },

    featuresRow: {
      display: "flex",
      gap: "20px",
      marginBottom: "40px",
      flexWrap: "wrap",
      justifyContent: "center"
    },

    featureBox: {
      flex: "1",
      minWidth: "240px",
      padding: "20px",
      borderRadius: "14px",
      display: "flex",
      gap: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    },

    fTitle: { fontWeight: "600", color: "#222" },
    fSub: { fontSize: "13px", color: "#666" },

    actions: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "20px",
      flexWrap: "wrap"
    },

    voiceBtn: {
      background: "#000",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600"
    },

    startBtn: {
      background: "linear-gradient(90deg,#4f46e5,#b91cff)",
      color: "#fff",
      padding: "12px 22px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600"
    },

    footer: {
      fontSize: "13px",
      color: "#999",
      marginTop: "10px"
    },

    assistantBox: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "300px",
      background: "#fff",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      borderRadius: "15px",
      padding: "15px",
      border: "1px solid #fff"
    },

    assistantHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px"
    },

    assistantClose: {
      border: "none",
      background: "transparent",
      fontSize: "18px",
      cursor: "pointer"
    },

    assistantBody: {
      fontSize: "14px",
      color: "#000",
      marginBottom: "10px"
    },

    assistantBtn: {
      width: "48%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      background: "#000000ff",
      cursor: "pointer",
      fontWeight: "600"
    },

    waveWrapper: {
      display: "flex",
      gap: "4px",
      height: "35px",
      alignItems: "center",
      marginTop: "5px"
    },

    waveBar: (delay) => ({
      width: "6px",
      height: "10px",
      background: "#6a5acd",
      borderRadius: "10px",
      animation: `wave 1s ease-in-out infinite`,
      animationDelay: `${delay}s`
    })
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerGradient}>
          <img
            src="/mnt/data/865058eb-e2f0-46d9-8c61-db696e0e3163.png"
            alt="logo"
            style={styles.logo}
          />
        </div>

        <h1 style={styles.title}>AI-Driven KYC Verification</h1>

        <p style={styles.subtitle}>
          Complete your KYC verification in minutes with our intelligent AI-powered system featuring voice assistance
        </p>

        {/* Features */}
        <div style={styles.featuresRow}>
          <div style={{ ...styles.featureBox, background: "#eef4ff" }}>
            <div style={{ fontSize: "24px" }}>⚡</div>
            <div>
              <div style={styles.fTitle}>Fast & Automated</div>
              <div style={styles.fSub}>Complete KYC in minutes</div>
            </div>
          </div>

          <div style={{ ...styles.featureBox, background: "#f8f1ff" }}>
            <div style={{ fontSize: "24px" }}>🎤</div>
            <div>
              <div style={styles.fTitle}>Voice Assisted</div>
              <div style={styles.fSub}>Hands-free guidance</div>
            </div>
          </div>

          <div style={{ ...styles.featureBox, background: "#eaffea" }}>
            <div style={{ fontSize: "24px" }}>🔒</div>
            <div>
              <div style={styles.fTitle}>Secure</div>
              <div style={styles.fSub}>Bank-grade encryption</div>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            style={styles.voiceBtn}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            🔊 {voiceEnabled ? "Voice Enabled" : "Voice Disabled"}
          </button>

          <button
            style={styles.startBtn}
            onClick={() => speak("Starting KYC verification.")}
          >
            Start KYC Verification
          </button>
        </div>

        <p style={styles.footer}>🔒 Your data is encrypted and secure.</p>
      </div>

      {/* Assistant */}
      {assistantVisible && (
        <div style={styles.assistantBox}>
          <div style={styles.assistantHeader}>
            <b>🔊 Voice Assistant</b>
            <button
              style={styles.assistantClose}
              onClick={() => setAssistantVisible(false)}
            >
              ×
            </button>
          </div>

          <div style={styles.assistantBody}>
            Welcome to AI-powered KYC verification. <br />
            Let me guide you through this process.
          </div>

          {isSpeaking && (
            <div style={styles.waveWrapper}>
              {[0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
                <div key={i} style={styles.waveBar(d)}></div>
              ))}

              <style>
                {`
                  @keyframes wave {
                    0% { height: 10px; }
                    50% { height: 35px; }
                    100% { height: 10px; }
                  }
                `}
              </style>
            </div>
          )}

          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            <button
              style={styles.assistantBtn}
              onClick={() => speak("I will guide you step by step.")}
            >
              Speak
            </button>

            <button
              style={styles.assistantBtn}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              {voiceEnabled ? "Disable" : "Enable"} Voice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
