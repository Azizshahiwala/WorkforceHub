import React, { useEffect, useState } from "react";
import "../../styles/Employees/ApplyLeave.css";
function ApplyLeave() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const leaveData = {
      empId: MySession.employeeId,
      name: MySession.name,
      department: MySession.role,
      startDate,
      endDate,
      reason,
      status: 'Not reviewed',
      dateSubmitted : Date.now()
    };
    
  const handleLeave = async (e) => {

    e.preventDefault()    

    if (!MySession) {
      alert("Please login again");
      return;
    }

    if (!startDate || !endDate || !reason) {
      alert("Please fill all fields.");
      return;
    }
    
    try{
      
      const response = await fetch(`${API_BASE_URL}/postLeaveRq/${MySession.employeeId}/${MySession.auth_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData),
      });

      const data = await response.json();
      if(data.status === "reason not provided"){
        alert("Reason is not given. Cannot approve. Please reject this leave.");
        return;
      }
      if(data.status === "datetime compare error"){
        alert("start and end date syntax is invalid. Please reject this leave.");
        return;
      }
      if (data.status === "success") {
        alert("Leave applied successfully");
        // Refresh local list after successful post
        
        updateFetchedLeaves(prev => [...prev, { ...leaveData, leaveData}]);
      
        alert("Leave applied successfully");

        setStartDate("");
        setEndDate("");
        setReason("");
      }
    }
    catch(err){
      console.error("Submission error:", err);
    }
    
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <div className="apply-leave-page">
      <form className="apply-leave-card" onSubmit={handleLeave}>
        <h2>Apply Leave</h2>

        {MySession && (
            <p className="emp-info">
              Logged in as <b>{MySession.name}</b> (
              {MySession.employeeId})
            </p>
        )}

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Reason</label>
        <input
          type="text"
          placeholder="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="apply-leave-actions">
          <button
            type="submit"
            className="apply-btn">
            Apply
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplyLeave;
