// src/pages/LeaveManager.jsx
import React from "react";
import "./LeaveManager.css";
import { useState,useEffect } from "react";

const data=JSON.parse(localStorage.getItem("leaveData")) || [];

function LeaveManager() {
  const [leaveRequests, setLeaveRequests] = useState(data);

  const removeRow = (id) => {
    const updatedData = leaveRequests.filter(item => item.id !== id);
    setLeaveRequests(updatedData);
    localStorage.setItem("leaveData", JSON.stringify(updatedData));
  };

  return (
    <div className="leave-page">
      <div className="leave-header">
        <div>
          <h2>Leave Request</h2>
        </div>
      </div>

      <div className="card leave-card">
        <div className="leave-card-header">
          <h3>Employee List</h3>
        </div>

        <table className="leave-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>EMPLOYEE ID</th>
              <th>Start DATE</th>
              <th>End DATE</th>
              <th>REASON</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="emp-cell">
                    <div className="emp-avatar">
                      {req.name.charAt(0)}
                    </div>
                    <span>{req.name}</span>
                  </div>
                </td>
                <td>{req.empId}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>{req.reason}</td>
                <td>
                  <button
                    className="btn btn-approve"
                    onClick={() => removeRow(req.id)}
                  >
                    ✓
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => removeRow(req.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveManager;
