// src/pages/LeaveManager.jsx
import React from "react";
import "../../styles/HR/LeaveManager.css";
import { useState,useEffect } from "react";
import MessageBox from "../../Misc/MessageBox";
// Getting existing leave data from [Employee ApplyLeave.jsx] localStorage

function LeaveManager() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState(null);
  useEffect(() => {
        fetch(`${API_BASE_URL}/fetchAllRq`,{method: 'GET',
  credentials: 'include'})
          .then(res => res.json())
          .then(data => setLeaveRequests(data))
          .catch(err => setMessage({ type: "Error", text:err}));
      }, []);

  const handleLeaveOption = async (Leaveid,option,employeeId) => {
    try{
      //This checks if option is accept / reject. then uses calls using leaveid
      if(option === "accept"){
        const response = await fetch(`${API_BASE_URL}/acceptLeave/${Leaveid}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({employeeId, Leaveid}),
      });

      const data = await response.json();
        if(data.status == "success"){
          setMessage({ type: "Success", text:data.name+"'s leave accepted."});
        }
        else{
          setMessage({ type: "Info", text:"Employee leave cannot be accepted. Please check for dates"});
          return;
        }
      }
      else if(option == "reject"){
        const response = await fetch(`${API_BASE_URL}/rejectLeave/${Leaveid}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({employeeId, Leaveid}),
      });

      const data = await response.json();
        if(data.status == "success"){
          setMessage({ type: "Success", text:data.name+"'s leave rejected."});        
        }
        else{
          setMessage({ type: "Success", text:"Employee id not found. Make sure the person has applied/enrolled."});
          return;
        }
      }
      const updatedData = leaveRequests.filter(item => item.Leaveid !== Leaveid);
      setLeaveRequests(updatedData);
      }
    catch(e){
      setMessage({ type: "Error", text:"Error:",e});
      return;
    }
};

  return (
    <div className="leave-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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
