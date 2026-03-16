import React, { useEffect, useState } from "react";
import "../../styles/Employees/AssignedTaskByHR.css";
function EmployeeDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [employee, setEmployee] = useState(() => {
    const savedSession = localStorage.getItem("MySession");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projectData"));
    if (stored) {
      setProjectData(stored);
    }
  }, []);

  if (!employee) {
    return (
      <div className="dashboard-error">
        <h2>Session not found. Please log in again.</h2>
      </div>
    );
  }

  if (!projectData) {
    return <h3 className="employee-no-task">No task assigned yet</h3>;
  }
  
  return (
     <div className="employee-view-page">
      <h1>Hello {employee.name};</h1>
      <h1 className="employee-view-title">Assigned Task</h1>
      <div className="employee-assigned-card">
        <h2>Assigned Project</h2>
        <p>
          <strong>Project Name:</strong> {projectData.projectName}
        </p>
        <p>
          <strong>Company Name:</strong> {projectData.companyName}
        </p>
        <h3>Assigned Team Members</h3>
        <ul>
          {projectData.employees.map((emp) => (
            <li key={emp.uid || emp.id}>
              {emp.name} - {emp.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployeeDashboard; 