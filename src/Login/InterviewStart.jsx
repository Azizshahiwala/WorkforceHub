import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewStart.css";

export default function InterviewStart() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const start = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    };
    start();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };

  const endCall = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    navigate("/end");
  };

  return (
    <div className="call-wrapper">
      <h2>🤖 AI Interview In Progress</h2>

      <div className="call-body">
        <div className="video-box ai-box">
          <div className="ai-avatar">🤖</div>
          <p>AI Interviewer</p>
        </div>

        <div className="video-box">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-preview"
          />
          <p>You</p>
        </div>
      </div>

      <div className="call-controls">
        <button
            className="control-btn mute"
            onClick={toggleMute}
        >
            {muted ? "🔊 Unmute" : "🔇 Mute"}
        </button>

        <button
            className="control-btn end"
            onClick={endCall}
        >
            📞 End Call
        </button>
        </div>
    </div>
  );
}
