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

  // 🔐 Protect route
  useEffect(() => {
    if (!selectedEmp) {
      alert("Session expired. Please login again.");
      navigate("/");
    }
  }, [selectedEmp, navigate]);

  const handleLeave = () => {
    if (!selectedEmp) {
      alert("Please login again");
      return;
    }

    if (!startDate || !endDate || !reason) {
      alert("Please fill all fields");
      return;
    }

    const leaveData = {
      id: Date.now(),
      empId: selectedEmp.employeeId,
      name: selectedEmp.name,
      startDate,
      endDate,
      reason,
      status: "Pending",
    };

    const existingLeaves =
      JSON.parse(localStorage.getItem("leaveData")) || [];

    existingLeaves.push(leaveData);
    localStorage.setItem(
      "leaveData",
      JSON.stringify(existingLeaves)
    );

    alert("Leave applied successfully");

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
        <h2>Apply Leave</h2>

        {selectedEmp && (
            <p className="emp-info">
              Logged in as <b>{selectedEmp.role}</b> (
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
            type="button"
            className="apply-btn"
            onClick={handleLeave}
          >
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
