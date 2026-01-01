import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

import hrImg from "../images/HR.png";
import empImg from "../images/employee.png";
import adminImg from "../images/admin.png";
import interviewerImg from "../images/interviewer.png";

const roles = [
  { id: "hr", label: "HR", img: hrImg },
  { id: "employee", label: "Employees", img: empImg },
  { id: "admin", label: "Admin", img: adminImg },
  { id: "interviewer", label: "Interviewer", img: interviewerImg },
];

export default function AccountLogin() {
  const [selectedRole, setSelectedRole] = useState("hr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔍 Login response:", data);  // DEBUG: Check this in console!

      // Defensive checks
      if (!data || typeof data !== "object") {
        alert("Server error - invalid response");
        return;
      }

      if (!data.role) {
        alert(data.message || "No role in response");
        return;
      }

      // Permission 1: Non-Staff (Admin, CEO, HR, Interviewer)
      if (data.Permission === 1) {
        const roleLower = data.role.toLowerCase();
        
        if (roleLower === "hr") {
          localStorage.setItem("hr", JSON.stringify(data));
          navigate("/dashboard");
        } else if (roleLower === "admin" || roleLower === "ceo") {
          localStorage.setItem("authority", JSON.stringify(data));
          navigate("/dashboardAdmin");
        } else {
          // Interviewer or other admin roles
          navigate("/interviewer");
        }
      } 
      // Permission 2: Staff (All other roles)
      else if (data.Permission === 2) {
        localStorage.setItem("employee", JSON.stringify(data));
        navigate("/dashboardEmployee");
      } 
      else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="title">Choose Account Type</h2>

        <div className="roles">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? "active" : "inactive"}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <img src={role.img} alt={role.label} className="role-img" />
              <p>{role.label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}