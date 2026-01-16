import React, { useState,useEffect } from "react";
import "../../styles/HR/Activity.css";
import { Navigate } from "react-router-dom";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [message, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const AdminSession = JSON.parse(localStorage.getItem("loggedInAdmin")); 
  const HRSession = JSON.parse(localStorage.getItem("loggedInHR"));

  if (!AdminSession && !HRSession) {
  return <Navigate to="/" />;
}

  //This fetches announcements from database, instead of localstorage.
  useEffect(() => {
      const loadActivities = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/fetchAnnouncements");
          const data = await response.json();
          setActivities(data)
        } catch (error) {
          console.error("Error loading announcements:", error);
        }
      };
  
      loadActivities();
    }, []);

  const givenById = AdminSession?.employeeId ?? HRSession?.employeeId;
  const addNewTask = (newActivity) => {
    setActivities(prev => {
      const updated = [newActivity, ...prev];
      return updated;
    });

    setNewTask("");
    setShowModal(false);
  };

  const sendActivity = async (e) => {
    try{
      e.preventDefault();

      if (!message.trim()) return;

      const response = await fetch(`http://localhost:5000/api/insertAnnouncement/${givenById}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if(response.ok){
        const data = await response.json(); 
        const dataCreated = data.dateCreated;
        const givenById = data.givenById;
        const givenByRole = data.givenByRole;

        const newActivity = {
        dateCreated : dataCreated,
        message : message,
        givenById : givenById,
        givenByRole : givenByRole
      };
      addNewTask(newActivity);
      }
    }
    catch(error){
      console.error("❌ error:", error);
      alert("Failed to upload announcement");
    }
  }
  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>Activity Dashboard</h2>
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <form onSubmit={sendActivity}>
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Add New Activity</h4>
            <textarea
              className="modal-textarea"
              placeholder="Enter activity..."
              value={message}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="modal-add">
                Add
              </button>
            </div>
          </div>
        </div>
        </form>
      )}
    </div>
  );
}

export default Activity;