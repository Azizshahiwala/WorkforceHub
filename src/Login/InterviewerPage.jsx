import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Interviewer.css";

export default function Interviewer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get candidate id from URL
  const queryParams = new URLSearchParams(window.location.search);
  const candidateId = queryParams.get("ref");

  const videoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  const navigate = useNavigate();

  const handleButtonClick = async () => {
  
    if (!candidateId) {
      setStatus("❌ Candidate ID missing in URL");
      return;
    }
    if (!ready) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStatus("✅ Camera & microphone ready. Click proceed to continue.");
        setReady(true);
        return;
      } catch (err) {
        console.error(err);
        setStatus("❌ Please allow camera and microphone access.");
        return;
      }
    }

    // ==============================
    // 📄 STEP 2: Fetch resume + start interview
    // ==============================
    try {
      const resumeResponse = await fetch(
        `${API_BASE_URL}/recruit/resume/${candidateId}`
      );

      if (!resumeResponse.ok) {
        throw new Error("Could not retrieve your application data.");
      }

      // Convert to File
      const resumeBlob = await resumeResponse.blob();
      const resumeFile = new File([resumeBlob], "resume.pdf", {
        type: "application/pdf",
      });

      setFile(resumeFile);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("candidateId", candidateId);

      const aiRes = await fetch(`${API_BASE_URL}/interview-process`, {
        method: "POST",
        body: formData,
      });

      const aiData = await aiRes.json();

      // Navigate to interview screen
      navigate(`/interviewer/start?ref=${candidateId}`, {
        state: aiData,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="interviewer-wrapper">
      <div className="interviewer-card">
        <h1>🎤 AI Interview</h1>
        <p className="subtitle">
          Ensure camera and mic are working before proceeding.
        </p>

        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-preview"
          />
        </div>

        <button className="start-btn" onClick={handleButtonClick}>
          {ready ? "Proceed" : "Start"}
        </button>

        {status && <p className="status">{status}</p>}

        {file && <p>Selected file: {file.name}</p>}
      </div>
    </div>
  );
}