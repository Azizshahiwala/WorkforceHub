import React from 'react';
import { Pie, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  ArcElement, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Employees } from './CompanyUser';
import "./Dashboard.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const employees = Employees;
  
  // Gender data
  const genderData = {
    labels: ["Male", "Female"],
    datasets: [{ 
      data: [employees.filter(e => e.Gender === "Male").length, employees.filter(e => e.Gender === "Female").length], 
      backgroundColor: ["#36A2EB", "#FF6384"] 
    }]
  };
  
  // Staff data  
  const staffCount = employees.filter(e => !["Admin", "CEO"].includes(e.department)).length;
  const staffData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [{ 
      data: [staffCount, employees.length - staffCount], 
      backgroundColor: ["#47B39C", "#EC6B56"] 
    }]
  };
  
  // Department data
  const deptCounts = employees.reduce((acc, e) => {
    const dept = e.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  
  const deptData = {
    labels: Object.keys(deptCounts),
    datasets: [{ 
      label: "Count", 
      data: Object.values(deptCounts),
      backgroundColor: "#36A2EB" 
    }]
  };


// Add this function inside Dashboard component
  const getAvgPerformance = () => {
  try {
    const data = localStorage.getItem("feedback");
    if (data) {
      const feedback = JSON.parse(data);

      // reduce() turns an array into a single value by processing each item one by one
      const avg = feedback.reduce((sum, f) => sum + parseInt(f.rating), 0) / feedback.length;
      
      // Math.round() rounds numbers to the nearest whole number.
      return Math.round(avg * 10) / 10; // 1 decimal place
    }
  } catch (e) {
    return 0;
  }
  return 0;
};
const reviewsCount = JSON.parse(localStorage.getItem("feedback") || "[]").length;

  return (
    <div className="dashboard">
      <h2>HR Dashboard</h2>

      {/* Staff Pie */}
      <div className="emp-summary">
        <h1 className="card-title">Staff Distribution</h1>
        <div className="pie-wrapper">
          <Pie data={staffData} />
          <div className="pie-center-text">
            <span>Total</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
      </div>

      {/* Gender Pie */}
      <div className="emp-summary">
        <h1 className="card-title">Gender Distribution</h1>
        <div className="pie-wrapper">
          <Pie data={genderData} />
          <div className="pie-center-text">
            <span>Total</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
      </div>

      <div className="emp-summary performance-card"> {/* CHANGED: small card */}
        <div className="avg-score">
          <span>Avg Performance</span>
          <strong>{getAvgPerformance()}</strong>
          <small>({reviewsCount} reviews)</small>
        </div>
      </div>


      {/* Department Bar */}
      <Bar data={deptData} />
    </div>
  );
}
