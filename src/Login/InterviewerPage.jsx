import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Interviewer.css";

export default function Interviewer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  //Search url params
  const queryParams = new URLSearchParams(window.location.search);
  //Get passed candidate id
  const candidateId = queryParams.get("ref");  
  const videoRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    if (!ready) {
      // First click → ask permission
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
      }
    }

    try {
      // Using existing resume from registration
      const resumeResponse = await fetch(`${API_BASE_URL}/recruit/resume/${candidateId}`);
      if (!resumeResponse.ok) throw new Error("Could not retrieve your application data.");

      //Convert to file object
      const resumeBlob = await resumeResponse.blob();
      const res = new File([resumeBlob], "resume.pdf", { type: "application/pdf" });
      setFile(res);

      const formData = new FormData();
      formData.append("resume", res);
      formData.append("candidateId", candidateId);
      // Now start the process
      const aiRes = await fetch(`${API_BASE_URL}/interview-process`, {
        method: "POST",
        body: formData,
      });

      const aiData = await aiRes.json();
      // Pass the generated questions and the ID to the next screen
      navigate(`/interviewer/start?ref=${candidateId}`, { state: aiData });
    } catch (err) {
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
};