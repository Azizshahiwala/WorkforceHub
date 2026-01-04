import React, { useEffect, useState } from "react";
import "./EmployeePerformance.css";

function Performance() {
  const [myFeedback, setMyFeedback] = useState([]);
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);

  // ✅ Read localStorage ONCE
  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("loggedInEmployee"));
    setLoggedInEmployee(emp);
  }, []);

  useEffect(() => {
    if (!loggedInEmployee) return;

    const storedFeedback =
      JSON.parse(localStorage.getItem("feedback")) || [];

    const employeeFeedback = storedFeedback.filter(
      (f) => f.empId === loggedInEmployee.employeeId
    );

    setMyFeedback(employeeFeedback);
  }, [loggedInEmployee]);

  if (!loggedInEmployee) {
    return <p>Please login to view performance</p>;
  }

  return (
    <div className="performance-page">
      <h2>My Performance</h2>

      {myFeedback.length > 0 ? (
        myFeedback.map((feed, index) => (
          <div className="feedback-card" key={index}>
            <h3>{feed.name}</h3>
            <p><strong>Employee ID:</strong> {feed.empId}</p>
            <p><strong>Rating:</strong> {feed.rating} ⭐</p>
            <p><strong>Comment:</strong> {feed.comment}</p>
          </div>
        ))
      ) : (
        <p>No Feedback for you, {loggedInEmployee.role}</p>
      )}
    </div>
  );
}

export default Performance;
