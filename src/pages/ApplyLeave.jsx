import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/ApplyLeave.css";

function ApplyLeave() {
  const navigate = useNavigate();

  const selectedEmp = JSON.parse(
    localStorage.getItem("loggedInEmployee")
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fetchedLeave,updateFetchedLeaves] = useState([])

  const leaveData = {
      empId: selectedEmp.employeeId,
      name: selectedEmp.name,
      department: selectedEmp.role,
      startDate,
      endDate,
      reason,
      status: 'Not reviewed',
      dateSubmitted : Date.now()
    };
  // 🔐 Protect route
  useEffect(() => {
    if (!selectedEmp) {
      alert("Session expired. Please login again.");
      navigate("/");
    }
  }, [selectedEmp, navigate]);

  const handleLeave = async (e) => {

    e.preventDefault()    

    if (!selectedEmp) {
      alert("Please login again");
      return;
    }

    if (!startDate || !endDate || !reason) {
      alert("Please fill all fields.");
      return;
    }
    
    try{
      
      const response = await fetch(`http://localhost:5000/api/postLeaveRq/${selectedEmp.employeeId}/${selectedEmp.auth_id}`, {
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

        {selectedEmp && (
            <p className="emp-info">
              Logged in as <b>{selectedEmp.name}</b> (
              {selectedEmp.employeeId})
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
