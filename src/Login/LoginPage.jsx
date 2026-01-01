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
  console.log([
    ["admin@workforce.com", "admin123", "Admin", "Male", "+911111111111"],
    ["ceo@workforce.com", "ceo999", "CEO", "Female", "+912222222222"],
    ["hr@workforce.com", "hr_secure", "HR", "Male", "+913333333333"],
    ["interview@workforce.com", "test456", "Interviewer", "Female", "+914444444444"],
    ["finance@workforce.com", "money123", "Finance", "Male", "+915555555555"],
    ["dev1@workforce.com", "dev123", "Developer", "Male", "+916666666666"],
    ["dev2@workforce.com", "dev123", "Developer", "Female", "+916666666667"],
    ["dev3@workforce.com", "dev123", "Developer", "Male", "+916666666668"],
    ["dev4@workforce.com", "dev123", "Developer", "Female", "+916666666669"],
    ["des1@workforce.com", "des123", "Designer", "Female", "+917777777771"],
    ["des2@workforce.com", "des123", "Designer", "Male", "+917777777772"],
    ["des3@workforce.com", "des123", "Designer", "Female", "+917777777773"],

    ["test1@workforce.com", "qa123", "Tester", "Male", "+918888888881"],
    ["test2@workforce.com", "qa123", "Tester", "Female", "+918888888882"],
    ["test3@workforce.com", "qa123", "Tester", "Male", "+918888888883"],
    ["sales1@workforce.com", "sale123", "Sales manager", "Female", "+919999999991"],
    ["sales2@workforce.com", "sale123", "Sales manager", "Male", "+919999999992"],
    ["sales3@workforce.com", "sale123", "Sales manager", "Female", "+919999999993"],

    ["support1@workforce.com", "help123", "Support", "Male", "+910101010101"],
    ["support2@workforce.com", "help123", "Support", "Female", "+910101010102"],

    ["intern1@workforce.com", "freelance", "Intern", "Female", "+910101010102"],
    ["intern2@workforce.com", "freelance", "Intern", "Female", "+910101010102"],
]);
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