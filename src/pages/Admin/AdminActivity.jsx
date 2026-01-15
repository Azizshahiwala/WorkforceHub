import React, { useState,useEffect } from "react";
import "../HR/Activity.css";
import { Navigate } from "react-router-dom";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const AdminSession = JSON.parse(localStorage.getItem("loggedInAdmin")); 
  const HRSession = JSON.parse(localStorage.getItem("loggedInHR"));

  if(!AdminSession || !HRSession){
    alert("Error: Please login to continue.");
    Navigate("/");
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

  let newActivity = {};
  const givenById = AdminSession?.employeeId ?? HRSession?.employeeId;
  const addNewTask = () => {
    if (!newTask.trim()) return;

     newActivity = {
      dateCreated,
      message : newTask,
      givenById,
      givenByRole
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev];
      
      // trigger notification flag
      localStorage.setItem("hasNewNotification", "true");
      return updated;
    });
    setNewTask("");
    setShowModal(false);
  };

  const sendActivity = async (e) => {
    try{
      e.preventDefault();
      const response = await fetch(`http://localhost:5000/api/insertAnnouncement/${givenById}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });
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
              <span className="activity-time">{item.time}</span>
              <p className="activity-text">{item.text}</p>
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
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="modal-add" onClick={addNewTask}>
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