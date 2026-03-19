import React, { useState, useEffect } from "react";
import "../../styles/HR/Activity.css";
import MessageBox from "../../Misc/MessageBox";
function Activity() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [activities, setActivities] = useState([]);
  const [message,setMessage] = useState(null);
  useEffect(() => {

    const loadActivities = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/fetchAnnouncements`);
        const data = await response.json();
        setActivities(data);
        localStorage.removeItem("hasNewNotification");
      } catch (error) {
        setMessage({ type: "Error", text: "Could not get announcement "+error });
      }
    };

    loadActivities();
  }, []);
  
  return (
    <div className="activity-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
      <div className="activity-header">
        <h2>Activity Dashboard</h2>
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
    </div>
  );
}

export default Activity;
