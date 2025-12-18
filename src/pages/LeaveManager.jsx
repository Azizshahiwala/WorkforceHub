// src/pages/LeaveManager.jsx
import React from "react";
import "./LeaveManager.css";
import { useState } from "react";

const data = [
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0012",
    type: "Casual Leave",
    date: "24 July, 2025 to 26 July, 2025",
    reason: "Going to Family Function",
  },
  {
    id: 2,
    name: "Maryam Amiri",
    employeeId: "LA-0011",
    type: "Casual Leave",
    date: "21 July, 2025 to 26 July, 2025",
    reason: "Attend Birthday party",
  },
  {
    id: 3,
    name: "Gary Camara",
    employeeId: "LA-0013",
    type: "Medical Leave",
    date: "11 Aug, 2025 to 21 Aug, 2025",
    reason: "Going to Development",
  },
  {
    id: 4,
    name: "Frank Camly",
    employeeId: "LA-0014",
    type: "Casual Leave",
    date: "20 July, 2025 to 26 July, 2025",
    reason: "Going to Holiday",
  },
];

function LeaveManager() {
  const [leaveRequests, setLeaveRequests] = useState(data);

  const removeRow = (id) => {
    setLeaveRequests(leaveRequests.filter(item => item.id !== id));
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
              <th>LEAVE TYPE</th>
              <th>DATE</th>
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
                <td>{req.employeeId}</td>
                <td>{req.type}</td>
                <td>{req.date}</td>
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
