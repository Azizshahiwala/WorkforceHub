// src/Misc/MessageBox.jsx
// Usage:
//   const [message, setMessage] = useState(null);
//   setMessage({ type: "Success", text: "Saved successfully." });
//   setMessage({ type: "Error", text: "Something went wrong." });
//   setMessage({ type: "Info", text: "Request is under review." });
//   Then render: <MessageBox message={message} />

import { useEffect } from "react";
import "./MessageBox.css"
function MessageBox({ message, onClose }) {

  useEffect(() => {
    if (!message) return;

    if (message.type !== "Error") {
      const timer = setTimeout(() => {onClose();}, 3000);
      return () => clearTimeout(timer);
    }
  }, [message,onClose]);

  if (!message) return null;

  let backgroundColor = "";
  let borderColor = "";
  
  if (message.type === "Success") {
    backgroundColor = "#e6f9ee";
    borderColor = "#22c55e";
   
  } else if (message.type === "Error") {
    backgroundColor = "#fdecea";
    borderColor = "#ef4444";
    
  } else if (message.type === "Info") {
    backgroundColor = "#e8f0fe";
    borderColor = "#3b82f6";
    
  }

  return (
    <div style={{
      backgroundColor: backgroundColor,
      border: `1px solid ${borderColor}`,
      
    }} className="msgbox">
      <span>{emoji}</span>
      <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
        {message.text}
      </span>
      <button
        onClick={onClose}
        className="msgbtn">
        ✕
      </button>
    </div>
  );
}

export default MessageBox;