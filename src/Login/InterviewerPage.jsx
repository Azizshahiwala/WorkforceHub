import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Interviewer.css";

export default function Interviewer() {
  const videoRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [stream, setStream] = useState(null);
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState([]);
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

        <h2>Upload Resume PDF</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button
          onClick={async () => {
            if (!file) {
              alert("Upload resume first");
              return;
            }

            const formData = new FormData();
            formData.append("resume", file);

            // ✅ DEFINE res properly
            const res = await fetch("http://localhost:5000/start-interview", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              alert("Resume upload failed");
              return;
            }

            const data = await res.json();

            navigate("/interviewer/start", { state: data });
          }}
        >
          Upload & Proceed
        </button>
      </div>
    </div>
  );
}
