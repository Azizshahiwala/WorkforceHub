import React, { useState, useEffect } from "react";
import "../../styles/HR/Activity.css";
import MessageBox from '../../Misc/MessageBox'
function Activity() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [activities, setActivities] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  // Fetch announcements from the database on load
  const loadActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchAnnouncements`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      setMessage({ type: "Error", text: "Error loading announcements:", error });
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const addNewActivity = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      // Post new announcement to backend using employeeId from session
      const response = await fetch(`${API_BASE_URL}/insertAnnouncement`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask), // Backend expects the message directly as the JSON body
      });

      if (response.ok) {
        setNewTask("");
        setShowModal(false);
        loadActivities(); // Refresh list to show new post
        localStorage.setItem("hasNewNotification", "true");
      } else {
        setMessage({ type: "Error", text: response.message });
        console.log(response.error)
      }
    } catch (error) {
      setMessage({ type: "Error", text: "Post activity error: "+error });
    }
  };

  return (
    <div className="activity-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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
              {/* <small className="activity-sender">Posted by: {item.givenByRole}</small> */}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form className="modal-box" onSubmit={addNewActivity}>
            <h4>Add New Activity</h4>
            <textarea
              className="modal-textarea"
              placeholder="Enter announcement for staff..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
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