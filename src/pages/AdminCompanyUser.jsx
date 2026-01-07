import React, { useState,useEffect } from "react";
import "./CompanyUser.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function UserInfo(empID, name, lastLogin) {
    return (
        <tr key={empID}>
            <td>{empID}</td>
            <td>{name}</td>
            <td>{lastLogin}</td>
        </tr>
    );
}

function CompanyUser() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });


useEffect(() => {
    //This useEffect loads Users from database CompanyUser once
    const loadUser=async()=>{
      try {
        //Get response into 'response'
          const response=await(fetch("http://localhost:5000/api/getCompanyUsers"));
        //convert response to json
        const data=await response.json();
        setEmployees(data)
      } catch (error) {
        console.error("Error from CompanyUser.jsx:", error);
      }};
    loadUser(); }, []);

  const [search, setSearch] = useState("");
  const staffCount = employees.filter(
    (emp) => emp.department !== "Admin" && emp.department !== "CEO"
  ).length;

  const nonStaffCount = employees.length - staffCount;

  const pieData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [
      {
        data: [staffCount, nonStaffCount],
        backgroundColor: ["#47B39C", "#EC6B56"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="leave-page">
      <div className="emp-summary">
        <div className="pie-wrapper">
          <Pie data={pieData} />
          <div className="pie-center-text">
            <span>Total</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
      </div>

      <input
          type="text"
          placeholder="Search by name... 🔍"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
          
        </div>

        {/* ✅ Grid instead of invalid table */}
        <div className="emp-grid">
          {employees
            .filter((emp) =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <div className="emp-card" key={emp.employeeId}>
                <button
                  className="remove-icon-btn"
                  onClick={() => removeEmployee(emp.id)}>
                  ✖
                </button>

                <div className="emp-card-row">
                  <span>Employee ID:</span>
                  <strong>{emp.employeeId}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Name:</span>
                  <strong>{emp.name}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Department:</span>
                  <strong>{emp.department}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Status:</span>
                  <strong className="status-active">Active</strong>
                </div>
                <div className="emp-card-row">
                  <span>Gender:</span>
                  <strong>{emp.gender}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Last Login:</span>
                  <strong>{emp.lastLogin}</strong>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyUser;