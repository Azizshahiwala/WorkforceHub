import React, { useEffect, useState } from "react";
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

import Lottie from "lottie-react";
import performanceAnimation from "../../assets/lottie/performance.json";

import "../../styles/Admin/AdminDashboard.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ===============================
     STATE (ALL HOOKS AT TOP)
  ================================ */
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [task, setTask] = useState("");
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===============================
     API CALLS
  ================================ */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/getCompanyUsers`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false); // ✅ dashboard ready
      })
      .catch(err => {
        console.error("Dashboard load error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/CloseLeaveDuration`)
      .then(res => res.json())
      .then(data => console.log(data.closedCount));
  }, []);

  /* ===============================
     SAVE TASKS
  ================================ */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(store));
  }, [store]);

  /* ===============================
     DATA CALCULATIONS
  ================================ */
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

  const staffCount = employees.filter(
    e => !["Admin", "CEO"].includes(e.department)
  ).length;

  const staffData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [{
      data: [staffCount, employees.length - staffCount],
      backgroundColor: ["#47B39C", "#EC6B56"]
    }]
  };

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

  const getAvgPerformance = () => {
    try {
      const data = localStorage.getItem("feedback");
      if (!data) return 0;

      const feedback = JSON.parse(data);
      if (!feedback.length) return 0;

      const avg =
        feedback.reduce((sum, f) => sum + Number(f.rating || 0), 0) /
        feedback.length;

      return Math.round(avg * 10) / 10;
    } catch {
      return 0;
    }
  };

  const reviewsCount =
    JSON.parse(localStorage.getItem("feedback") || "[]").length;

  /* ===============================
     TASK HANDLERS
  ================================ */
  const addTask = () => {
    if (!task.trim()) return;
    setStore(prev => [...prev, task.trim()]);
    setTask("");
  };

  const removeTask = (index) => {
    setStore(prev => prev.filter((_, i) => i !== index));
  };

  /* ===============================
     FULL SCREEN LOADER
  ================================ */
  if (loading) {
    return (
      <div className="dashboard-loader">
        <Lottie
          animationData={performanceAnimation}
          loop
          style={{ width: 220, height: 220 }}
        />
        <b>Loading Admin Dashboard...</b>
      </div>
    );
  }

  /* ===============================
     DASHBOARD UI
  ================================ */
  return (
    <div className="dashboard">
      <h3>Admin Dashboard</h3>

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

      <div className="emp-summary performance-card">
        <div className="avg-score">
          <span>Avg Performance</span>
          <strong>{getAvgPerformance()}</strong>
          <small>({reviewsCount} reviews)</small>
        </div>
      </div>

      <div className="emp-summary todo-card">
        <h1 className="card-title">TO-DO List 📃</h1>

        <div className="todo-input-row">
          <label>Enter task:</label>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="todo-list">
          {store.map((t, index) => (
            <li key={index} className="todo-item">
              <span>{t}</span>
              <button
                className="todo-remove-btn"
                onClick={() => removeTask(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Bar data={deptData} />
    </div>
  );
}