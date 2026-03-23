import React, { useEffect, useState } from "react";
import "../../styles/Employees/ApplyLeave.css";
import MessageBox from "../../Misc/MessageBox";
function ApplyLeave() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  
  const [message,setMessage]=useState(null);
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
      setMessage({ type: "Error", text: "Please log in again."});
      return;
    }

    if (!startDate || !endDate || !reason) {
      setMessage({ type: "Info", text: "Please fill all the fields."});
      return;
    }
    
    try{
      const response = await fetch(`${API_BASE_URL}/postLeaveRq`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData),
      });

      const data = await response.json();
      console.log(data);
      if(data.status === "reason not provided"){
        setMessage({ type: "Info", text: "Reason is not given. Cannot approve. Please reject this leave."});
        return;
      }
      if(data.status === "datetime compare error"){
        setMessage({ type: "Info", text: "start and end date is invalid. Please reject this leave."});
        return;
      }
      if (data.status === "success") {
        setMessage({ type: "Success", text: data.message});
        setStartDate("");
        setEndDate("");
        setReason("");
      }
    }
    catch(err){
      setMessage({ type: "Error", text: "Submission error:"+ err});
      console.log("Submission error:"+ err);
    }
    
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <div className="apply-leave-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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
