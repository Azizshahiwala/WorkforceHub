import {React,useEffect,useState} from 'react';
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
import "./AdminDashboard.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [employees,setEmployees] = useState([])
    
    useEffect(() => {
      fetch("http://localhost:5000/api/getCompanyUsers")
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error("Dashboard load error:", err));
    }, []);
  
    // Gender data
    const genderData = {
      labels: ["Male", "Female"],
      datasets: [{ 
        data: [
          employees.filter(e => e.gender === "Male").length, 
          employees.filter(e => e.gender === "Female").length
        ], 
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
}
const reviewsCount = JSON.parse(localStorage.getItem("feedback") || "[]").length;

  // TO-DO List State and Handler

  const [task, setTask] = useState("");
  const [store, setStore] = useState(() => {
  // runs once on first render
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
});

// Save to localStorage whenever list changes
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(store));
}, [store]);

const addTask = () => {
  if (!task.trim()) return;
  setStore(old => [...old, task.trim()]);
  setTask("");
};

const removeTask = (index) => {
  setStore(old => old.filter((_, i) => i !== index));
};
  return (
    <div className="dashboard">
      <h3>Admin Dashboard</h3>

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

{/* TO-DO list */}
<div className="emp-summary todo-card">
  <h1 className="card-title">TO-DO List 📃</h1>

  <div className="todo-input-row">
    <label>Enter task:</label>
    <input
      type="text"
      value={task}
      onChange={(e) => setTask(e.target.value)}
    />
    <button type="button" onClick={addTask}>Add</button>
  </div>

  <ul className="todo-list">
    {store.map((t, index) => (
      <li key={index} className="todo-item">
        <span>{t}</span>
        <button
          type="button"
          className="todo-remove-btn"
          onClick={() => removeTask(index)}
        >
          X
        </button>
      </li>
    ))}
  </ul>
</div>

     {/* Department Bar */}
      <Bar data={deptData} />
    </div>
  );
}
