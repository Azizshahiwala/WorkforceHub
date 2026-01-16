import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  const MySession = JSON.parse(localStorage.getItem("MySession"));
  
  setEmployee(MySession);

  if (!employee) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Welcome, {employee.name}!</h1>
    </div>
  );
}

export default EmployeeDashboard; 