import React from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewEnd.css";
export default function InterviewEnd() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>✅ Interview Completed</h1>
      <p>Thank you! Our AI will review your interview.</p>
      <button onClick={() => navigate("/")} className="control-btn mute">
        Back to Login
      </button>
    </div>
  );
}
