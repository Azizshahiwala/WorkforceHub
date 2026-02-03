import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InterviewStart.css";

export default function InterviewStart() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect safely if state missing
  useEffect(() => {
    if (!location.state) {
      navigate("/interviewer");
    }
  }, [location, navigate]);

  if (!location.state) return null;

  const { profession = "", questions = [] } = location.state;

  // ---- GREETING + INTRO QUESTION (FRONTEND CONTROLLED) ----
  const interviewerName = "MSP Concept HR Team";
  const introQuestion = `Hello, I am ${interviewerName}. Please tell me about yourself and your background.`;

  // ---- Last greeting message ----
  const closingMessage = 
  "Thank you for giving the interview. We appreciate your time and effort. " +
  "Our team will carefully review your responses and contact you soon. " +
  "Have a great day!";
  const allQuestions = [introQuestion, ...questions];

  // ---- STATE ----
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [listening, setListening] = useState(false);
  const [answers, setAnswers] = useState({});

  // ---- SPEAK FUNCTION ----
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Speak when question changes
  useEffect(() => {
    speak(allQuestions[currentQuestion]);
  }, [currentQuestion]);

  // ---- START CAMERA ----
  useEffect(() => {
    const startMedia = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    };
    startMedia();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ---- MUTE ----
  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };

  // ---- END INTERVIEW ----
  const endCall = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    navigate("/interviewer/end");
  };

  // ---- SPEECH TO TEXT ----
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: transcript,
      }));
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  // ---- NEXT QUESTION ----
  const nextQuestion = () => {
    if (currentQuestion + 1 < allQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/interviewer/end");
    }
  };

  // ---- UI ----
  return (
    <div className="call-wrapper">
      <h2>🤖 AI Interview In Progress</h2>
      <h3>Role: {profession}</h3>

      <div className="question-box">
        <h2>Question {currentQuestion + 1}</h2>
        <p>{allQuestions[currentQuestion]}</p>

        {answers[currentQuestion] && (
          <div className="answer-box">
            <h4>Your Answer:</h4>
            <p>{answers[currentQuestion]}</p>
          </div>
        )}
      </div>

      <div className="call-body">
        <div className="video-box ai-box">
          <div className="ai-avatar">🤖</div>
          <p>{interviewerName}</p>
        </div>

        <div className="video-box">
          <video ref={videoRef} autoPlay playsInline muted className="video-preview" />
          <p>You</p>
        </div>
      </div>

      <div className="call-controls">
        <button className="control-btn mute" onClick={toggleMute}>
          {muted ? "🔊 Unmute" : "🔇 Mute"}
        </button>

        <button className="control-btn mute" onClick={() => speak(allQuestions[currentQuestion])}>
          🔁 Repeat
        </button>

        <button className="control-btn mute" onClick={startListening} disabled={listening}>
          {listening ? "🎙️ Listening..." : "🎤 Answer"}
        </button>

        <button className="control-btn mute" onClick={nextQuestion}>
          Next Question
        </button>

        <button className="control-btn end" onClick={endCall}>
          📞 End Call
        </button>
      </div>
    </div>
  );
}
