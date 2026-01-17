import React, { useState, useEffect } from "react";
import "../../styles/HR/Activity.css";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const MySession = JSON.parse(localStorage.getItem("MySession"));

  const loadActivities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchAnnouncements");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const sendActivity = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // FIXED: Corrected the URL parameter to use MySession.employeeId
      const response = await fetch(`http://localhost:5000/api/insertAnnouncement/${MySession.employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const data = await response.json(); 
        
        // Update local state with the complete record from backend
        setActivities(prev => [{
          dateCreated: data.dateCreated,
          message: data.message,
          givenById: data.givenById,
          givenByRole: data.givenByRole
        }, ...prev]);

        setMessage("");
        setShowModal(false);
      } else {
        alert("Failed to upload announcement");
      }
    } catch (error) {
      console.error("❌ error:", error);
      alert("Server error during upload");
    }
  };

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>Admin Activity Dashboard</h2>
        <button className="activity-btn" onClick={() => setShowModal(true)}>
          + New Activity
        </button>
      </div>

      <div className="activity-list">
        {activities.map((item, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            {index !== activities.length - 1 && (
              <div className="activity-line"></div>
            )}
            <div className="activity-content">
              <span className="activity-time">{item.dateCreated}</span>
              <p className="activity-text">{item.message}</p>
              <small>ID: {item.givenById} ({item.givenByRole})</small>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form className="modal-box" onSubmit={sendActivity}>
            <h4>Add New Activity</h4>
            <textarea
              className="modal-textarea"
              placeholder="Post a company-wide update..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="modal-add">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Activity;