import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
     const selectedEmp = JSON.parse(
    localStorage.getItem("loggedInEmployee")
  );

    if (!selectedEmp) {
      navigate("/");
    } else {
      setEmployee(selectedEmp);
    }
  }, [navigate]);

  if (!employee) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Welcome, {employee.role}!</h1>
      <p>This is {employee.name}'s employee dashboard.</p>
    </div>
  );
}

export default EmployeeDashboard; 