import React, { useEffect, useState } from "react";
import "./EmployeePerformance.css";

//THIS file is FOR individual employees. where they look their performance
function EmployeePerformance() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("feedback");
    if (data) {
      setFeedback(JSON.parse(data));
    }
  }, []);

  const removeEmployee = (empId) => {
    const deleted=feedback.filter((f)=>f.empId!==empId);
    setFeedback(deleted);
    localStorage.setItem("feedback",JSON.stringify(deleted));
  }

  return (
    <div className="performance-page">
      <h2>Employees Feedback</h2>

      <div className="card-container">
        {feedback.length > 0 ? (
          feedback.map((feed, index) => (
            <div className="feedback-card" key={index}>
              <button 
              className="remove-icon-btn"
              onClick={()=> removeEmployee(feed.empId)}>X</button>
              <h3>{feed.name}</h3>
              <p><strong>Employee ID:</strong> {feed.empId}</p>
              <p><strong>Rating:</strong> {feed.rating} ⭐</p>
              <p><strong>Comment:</strong> {feed.comment}</p>
            </div>
          ))
        ) : (
          <p>No feedback found</p>
        )}
      </div>
    </div>
  );
}

export default EmployeePerformance;
