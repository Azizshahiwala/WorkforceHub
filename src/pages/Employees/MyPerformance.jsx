import React, { useEffect, useState } from "react";
import "../../styles/HR/EmployeePerformance.css";
//THIS file is for individual Employee ONLY
function EmployeePersonalPerformance() {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const [performance, setPerformance] = useState([]);
const [loggedInEmployee, setLoggedInEmployee] = useState(null);
const [loading, setLoading] = useState(true);

const MySession = JSON.parse(localStorage.getItem("MySession"));

useEffect(() => {
  setLoggedInEmployee(MySession);
}, []);

useEffect(() => {
  fetch(`${API_BASE_URL}/myPeformancesAndFeedbacks/${loggedInEmployee.employeeId}`)
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
              Updated on: {feed.createdAt}
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
