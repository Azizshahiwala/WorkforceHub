import React, { useEffect, useState } from "react";
import "../../styles/Employees/AssignedTaskByHR.css";
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
     <div className="employee-view-page">
      <h1>Hello {employee.name};</h1>
      <h3>Employee ID: {employee.employeeId}</h3>
      <h2>Welcome to your dashboard!</h2>
      <h3>Role:{employee.role}</h3>
      <h3>Email: {employee.email}</h3>
    </div>
  );
}

export default EmployeeDashboard; 