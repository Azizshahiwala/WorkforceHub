import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const empData = localStorage.getItem("employee");

    if (!empData) {
      navigate("/");
    } else {
      setEmployee(JSON.parse(empData));
    }
  }, [navigate]);

  if (!employee) return <h2>Loading...</h2>;

  return (

    <div>
      <h1>Welcome, {employee.role}!</h1>
    </div>
  );

    <div>Employee Dashboard</div>
  )

}
