import React, { useEffect, useState } from "react";
import MessageBox from "../../Misc/MessageBox";
function EmployeeDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [employee, setEmployee] = useState(() => {
    const savedSession = localStorage.getItem("MySession");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  if (!employee) {
    return (
      <div className="dashboard-error">
        <h2>Session not found. Please log in again.</h2>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Welcome, {employee.name}!</h1>
    </div>
  );
}

export default EmployeeDashboard; 