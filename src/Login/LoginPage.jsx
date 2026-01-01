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
      console.log("🔍 Login response:", data);

      if (!data || !data.Permission) {
        alert("Invalid login response");
        return;
      }

      // 🔐 STAFF (EMPLOYEE)
      if (data.Permission === 2) {
        // ✅ SAVE LOGGED-IN EMPLOYEE (IMPORTANT)
        localStorage.setItem(
          "loggedInEmployee",
          JSON.stringify({
            employeeId: data.employeeId || data.empId || data.id,
            name: data.name || data.fullName || data.username,
            email: data.email,
            role: data.role,
          })
        );

        navigate("/dashboardEmployee");
      }

      // 🔐 NON-STAFF (HR / ADMIN / CEO / INTERVIEWER)
      else if (data.Permission === 1) {
        const role = data.role?.toLowerCase();

        if (role === "hr") {
          localStorage.setItem("loggedInHR", JSON.stringify(data));
          navigate("/dashboard");
        } else if (role === "admin" || role === "ceo") {
          localStorage.setItem("loggedInAdmin", JSON.stringify(data));
          navigate("/dashboardAdmin");
        } else {
          navigate("/interviewer");
        }
      } else {
        alert("Login failed");
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
              className={`role-card ${
                selectedRole === role.id ? "active" : "inactive"
              }`}
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
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
