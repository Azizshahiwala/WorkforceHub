import React, { useState, useEffect } from "react";
import "./Activity.css";

function Activity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("activities")) || [];
  setActivities(stored);

  const handleStorageChange = (event) => {
    if (event.key === "activities") {
      setActivities(JSON.parse(event.newValue));
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);


  return (
    <div className="activity-page">
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
              <span className="activity-time">{item.time}</span>
              <p className="activity-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
