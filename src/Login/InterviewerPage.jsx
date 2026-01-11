import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Interviewer.css";

export default function Interviewer() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("");
  const [stream, setStream] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    if (!ready) {
      // First click → ask permission
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStatus("✅ Camera & microphone ready. Click proceed to continue.");
        setReady(true);
      } catch (err) {
        console.error(err);
        setStatus("❌ Please allow camera and microphone access.");
      }
    } else {
      // Second click → go to interview page
      navigate("/interview/start");
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
          {ready ? "Proceed to Interview" : "Start Interview"}
        </button>

        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
}
