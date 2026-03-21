import React, { useEffect, useState } from "react";
import "../../styles/HR/EmployeePerformance.css";
import MessageBox from "../../Misc/MessageBox";

function AdminEmployeePerformance() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [message, setMessage] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/all`,{method: 'GET',
  credentials: 'include'});
      const data = await response.json();
      if (response.ok) {
        setFeedback(data);
      } else {
        setMessage({ type: "Error", text: data.message || "Failed to load feedback." });
      }
    } catch (err) {
      setMessage({ type: "Error", text: "Could not connect to server." });
    }
  };

  const removeFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback((prev) => prev.filter((f) => f.feedbackId !== feedbackId));
        setMessage({ type: "Success", text: "Feedback removed." });
      } else {
        setMessage({ type: "Error", text: data.message || "Failed to remove feedback." });
      }
    } catch (err) {
      setMessage({ type: "Error", text: "Could not connect to server." });
    }
  };

  return (
    <div className="performance-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
      <h2>Employees Feedback</h2>

      <div className="card-container">
        {feedback.length > 0 ? (
          feedback.map((feed, index) => (
            <div className="feedback-card" key={index}>
              <button
                className="remove-icon-btn"
                onClick={() => removeFeedback(feed.feedbackId)}
              >
                X
              </button>
              <h3>{feed.name}</h3>
              <p><strong>Employee ID:</strong> {feed.empId}</p>
              <p><strong>Rating:</strong> {feed.rating} ⭐</p>
              <p><strong>Comment:</strong> {feed.comment}</p>
              <p><strong>Given By:</strong> {feed.givenBy}</p>
              <p><strong>Date:</strong> {feed.createdAt}</p>
            </div>
          ))
        ) : (
          <p>No feedback found</p>
        )}
      </div>
    </div>
  );
}

export default AdminEmployeePerformance;