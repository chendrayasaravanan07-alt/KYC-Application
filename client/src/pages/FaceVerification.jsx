import React, { useRef, useState } from "react";

export default function FaceVerification() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraActive(true);
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access blocked!");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Capture Frame from camera
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const data = canvas.toDataURL("image/png");
    setImageSrc(data);
    stopCamera();
  };

  // Upload file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      stopCamera();
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#fff", textAlign: "center", padding: "30px" }}>

      {/* Top Icon */}
      <div style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: "#f3e8ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto"
      }}>
        <span style={{ fontSize: "30px", color: "#a34bff" }}>📷</span>
      </div>

      {/* Title */}
      <h1 style={{ marginTop: "10px", fontSize: "32px", fontWeight: "600" }}>Face Verification</h1>
      <p style={{ marginTop: "-10px", color: "#666" }}>
        We'll match your live photo with your ID
      </p>

      {/* Camera Preview Box */}
      <div
        onClick={startCamera}
        style={{
          width: "100%",
          maxWidth: "850px",
          height: "350px",
          background: "#0c1525",
          borderRadius: "14px",
          margin: "30px auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraActive ? "block" : "none" }}
        />

        {/* Uploaded / Captured Image */}
        {imageSrc && !cameraActive && (
          <img
            src={imageSrc}
            alt="captured"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* Placeholder */}
        {!cameraActive && !imageSrc && (
          <div>
            <div style={{ fontSize: "50px", opacity: 0.4 }}>📷</div>
            <p style={{ marginTop: "-10px", opacity: 0.7 }}>Camera Preview / Upload Photo</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div
        style={{
          background: "#f2f6ff",
          padding: "12px",
          maxWidth: "850px",
          borderRadius: "10px",
          margin: "auto",
          fontSize: "14px",
          color: "#4d5e9d"
        }}
      >
        ℹ️ Click “Start Camera” or upload a photo to begin face verification
      </div>

      {/* Tips Row */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "25px" }}>
        <div style={{ background: "#f1fff1", padding: "12px 30px", borderRadius: "10px", fontSize: "14px" }}>
          💡 Good lighting
        </div>
        <div style={{ background: "#fff8e6", padding: "12px 30px", borderRadius: "10px", fontSize: "14px" }}>
          😊 Look at camera
        </div>
        <div style={{ background: "#eef6ff", padding: "12px 30px", borderRadius: "10px", fontSize: "14px" }}>
          🧊 Hold steady
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "30px" }}>
        {/* Start Camera */}
        <button
          onClick={startCamera}
          style={{
            border: "1px solid #ccc",
            padding: "12px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "20px",
            background: "white",
            fontSize: "15px"
          }}
        >
          📷 Use Camera
        </button>

        {/* Upload Photo */}
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: "12px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#553bff",
            color: "white",
            fontSize: "15px",
            border: "none"
          }}
        >
          ⬆️ Upload Photo
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>

      {/* Capture Button (only if camera active) */}
      {cameraActive && (
        <button
          onClick={capturePhoto}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#00c853",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          Capture Photo
        </button>
      )}
    </div>
  );
}
