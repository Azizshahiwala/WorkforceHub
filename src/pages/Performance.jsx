import React, { useEffect, useState } from "react";
import "./EmployeePerformance.css";
//THIS file is for individual Employee ONLY

function EmployeePersonalPerformance() {
const [performance, setPerformance] = useState([]);
const [loggedInEmployee, setLoggedInEmployee] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const emp = JSON.parse(localStorage.getItem("loggedInEmployee"));
  setLoggedInEmployee(emp);
}, []);

useEffect(() => {
  if (!loggedInEmployee?.employeeId) return;

  fetch(`http://localhost:5000/api/myPeformancesAndFeedbacks/${loggedInEmployee.employeeId}`)
    .then(res => res.json())
    .then(data => {
      setPerformance(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Performance fetch error:", err);
      setLoading(false);
    });
}, [loggedInEmployee]);

    if (loading) {
    return <p>Loading performance...</p>;
    }
    if (!loggedInEmployee) {
    return <p>Please login to view performance</p>;
  }
  return (
    <div className="performance-page">
      <h2>My Performance</h2>

      {performance.length > 0 ? (
        performance.map((feed, index) => (
          <div className="feedback-card" key={index}>
            <h3>{feed.period}</h3>
            <p><strong>Employee ID:</strong> {feed.empId}</p>
            <p><strong>Rating:</strong> {feed.rating} ⭐</p>
            <p><strong>Comment:</strong> {feed.comment}</p>
            <p className="date">
              Updated on: {feed.lastUpdated}
            </p>
          </div>
        ))
      ) : (
        <p>Feedbacks not found for {loggedInEmployee.role}</p>
      )}
    </div>
  );
}

export default EmployeePersonalPerformance;
