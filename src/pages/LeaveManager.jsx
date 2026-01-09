// src/pages/LeaveManager.jsx
import React from "react";
import "./LeaveManager.css";
import { useState,useEffect } from "react";


function LeaveManager() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  //This use effects fetches all emp rq leaves
  useEffect(() => {
        fetch(`http://localhost:5000/api/fetchAllRq`)
          .then(res => res.json())
          .then(data => setLeaveRequests(data))
          .catch(err => console.error("Error loading personal leaves:", err));
      }, []);
  
  //This use effects checks if leave is expired or not.
  useEffect(() => {
        fetch(`http://localhost:5000/api/CloseLeaveDuration`)
          .then(res => res.json())
          .then(data => console.log(data.closedCount));
      }, []);

  const handleLeaveOption = async (Leaveid,option,employeeId) => {
    try{
      if(option === "accept"){
        const response = await fetch(`http://localhost:5000/api/acceptLeave/${employeeId}/${Leaveid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({employeeId, Leaveid}),
      });

      const data = await response.json();
        if(data.success){
          alert(data.name+"'s leave accepted.");
        }
        else{
          alert("Employee leave cannot be accepted. Please check for dates");
          return;
        }
      }
      else if(option == "reject"){
        const response = await fetch(`http://localhost:5000/api/rejectLeave${employeeId}/${Leaveid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({employeeId, Leaveid}),
      });

      const data = await response.json();
        if(data.success){
          alert(data.name+"'s leave rejected.");
        }
        else{
          alert("Employee id not found. Make sure the person has applied/enrolled.");
          return;
        }
      }
      const updatedData = leaveRequests.filter(item => item.id !== id);
      setLeaveRequests(updatedData);
      }
    catch(e){
      console.log("Error from leavemanger.jsx: "+e);
      alert("An error occurred");
      return;
    }
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
              <tr key={req.Leaveid}>
                <td>{req.Leaveid}</td>
                <td>
                  <div className="emp-cell">
                    <div className="emp-avatar">
                      {/* {req.name.charAt(0)} */}
                    </div>
                    <span>{req.name}</span>
                  </div>
                </td>
                <td>{req.employeeId}</td>
                <td>{req.startdate}</td>
                <td>{req.enddate}</td>
                <td>{req.reason}</td>
                <td>
                  <button
                    className="btn btn-approve"
                    onClick={() => handleLeaveOption(req.Leaveid,"accept",req.employeeId)}>
                    ✓
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleLeaveOption(req.Leaveid,"reject",req.employeeId)}>
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
