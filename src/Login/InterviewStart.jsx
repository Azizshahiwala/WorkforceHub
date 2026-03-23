import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InterviewStart.css";
import MessageBox from '../Misc/MessageBox';
export default function InterviewStart() {
  const [message,setMessage] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  // ---- STATE ----
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  //listening for vocal answers
  const [listening, setListening] = useState(false);
  const [answers, setAnswers] = useState({});
  //snippet for coding answers
  const [snippet,addsnippets] = useState("");

  // Redirect safely if state missing
  useEffect(() => {
    if (!location.state) {
      navigate("/interviewer");
    }
  }, [location, navigate]);

  if (!location.state) return null;

  const { profession = "", questions = [] } = location.state;

  // ---- GREETING + INTRO QUESTION (FRONTEND CONTROLLED) ----
  const interviewerName = "Workforce Hub AI System";
  const introQuestion = `Hello, I am ${interviewerName}. Please tell me about yourself and your background.`;

  // ---- Last greeting message ----
  const closingMessage = 
  "Thank you for giving the interview. We appreciate your time and effort. " +
  "Our team will carefully review your responses and contact you soon. " +
  "Have a great day!";
  const allQuestions = [introQuestion, ...questions];

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
    //clear snippets or append.
    addsnippets(answers[currentQuestion] || "");
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

  const SubmitAnswers = async (candidateId, answers) => {
  const formattedAnswers = allQuestions
    .map((q, i) => `Q: ${q}\nA: ${answers[i] || "No response"}`)
    .join("\n\n");

  const response = await fetch(`${API_BASE_URL}/recruit/process-test`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: candidateId, answers: formattedAnswers }),
  });
  if(response.ok){speak(closingMessage);}
      else{
        setMessage({ type: "Error", text: "Submission failed. Check your connection and try again." });
        navigate(`/interviewer/end`);
      }
};

  const endCall = async () => {
  if (stream) stream.getTracks().forEach((t) => t.stop());

  setSubmitting(true);
  const queryParams = new URLSearchParams(window.location.search);
  const candidateId = queryParams.get("ref");

  if (candidateId) {
    try {
      await SubmitAnswers(candidateId, answers);
    } catch (err) {
      console.error("Failed to submit on end call:", err);
    }
  }
  setSubmitting(false);
  navigate("/interviewer/end");
};

  const handleCodeChange = (event) => {
    //Update if textbox is changed
      addsnippets(event.target.value);

      setAnswers((prev) => ({
    ...prev,
    [currentQuestion]: snippet,
  }));
  }
  // ---- SPEECH TO TEXT ----
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setMessage({ type: "Info", text: "Speech recognition not supported in this browser." });
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
  const nextQuestion = async () => {
  if (currentQuestion + 1 < allQuestions.length) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    
    // FIX: Define queryParams before using it!
    const queryParams = new URLSearchParams(window.location.search);
    const candidateId = queryParams.get("ref");

    if (!candidateId) {
      setMessage({ type: "Error", text: "Candidate ID is missing from the URL." });
      return;
    }
    const formattedAnswers = allQuestions
      .map((q, i) => `Q: ${q}\nA: ${answers[i] || "No response"}`)
      .join("\n\n");

      setSubmitting(true);
    try {
      await SubmitAnswers(candidateId, answers);
      setTimeout(() => navigate("/interviewer/end"), 5000);
    } catch (err) {
      setMessage({ type: "Error", text: "Something went wrong. Please try again." });
      navigate("/interviewer/end");
    }
    finally{
      setSubmitting(false);
    }
  }
};

  // ---- UI ----
  return (
    <div className="call-wrapper">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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

        <div className="code-container">
          <label>💻 Code / Text Editor:</label>
        <textarea
        className="code-editor"
        placeholder="<html/>,import,etc.." 
        value={snippet}
        onChange={handleCodeChange}>
        </textarea>
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
        {submitting ? <div className="interview-loader"/> : <button className="control-btn mute" onClick={nextQuestion}>
          Next Question
        </button>}
        
        {submitting ? <div className="interview-loader"/> : <button className="control-btn end" onClick={endCall}>
          📞 End Call
        </button>}
      </div>
    </div>
  );
}
