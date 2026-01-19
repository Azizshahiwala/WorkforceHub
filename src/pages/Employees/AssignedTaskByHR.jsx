import React, { useEffect, useState } from "react";

function EmployeeView() {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projectData"));
    if (stored) setProjectData(stored);
  }, []);

  if (!projectData) {
    return <h3 style={{ textAlign: "center" }}>No task assigned yet</h3>;
  }

  return (
    <div style={styles.card}>
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
          <li key={emp.id}>
            {emp.name} - {emp.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  card: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    fontFamily: "Arial",
  },
};

export default EmployeeView;
