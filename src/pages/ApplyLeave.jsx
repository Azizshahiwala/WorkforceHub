import React from 'react'
import { useEffect,useState } from 'react'
import "../pages/ApplyLeave.css";
function ApplyLeave() {
    const selectedEmp = {
        employeeId: "LA-0012",
        name: "Marshall Nichols"
    };
    const[startDate,setStartDate]=useState("");
    const[endDate,setEndDate]=useState("");
    const[reason,setReason]=useState("");

    const handleLeave=()=>{
        if (!startDate || !endDate || !reason) {
            alert("Please fill all fields");
            return;
        }
        const data={
            id:Date.now(),  
            empId: selectedEmp.employeeId,
            name: selectedEmp.name,
            startDate,
            endDate,
            reason,
        };
        // GET existing leave requests (array)
        const existingLeaves = JSON.parse(localStorage.getItem("leaveData")) || [];

        // ✅ ADD new request
        existingLeaves.push(data);

        // ✅ SAVE back to localStorage
        localStorage.setItem("leaveData", JSON.stringify(existingLeaves));
    setStartDate("");
    setEndDate("");
    setReason("");
    };

    const handleCancel = () => {
        setStartDate("");
        setEndDate("");
        setReason("");
    };

  return (
    <div className="apply-leave-page">
    <form className="apply-leave-card">
      <h2>Apply Leave Page</h2>

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
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="apply-leave-actions">
        <button type="button" className="apply-btn" onClick={handleLeave}>
          Apply
        </button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  </div>
  )
}

export default ApplyLeave