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

    try{
      const response = await fetch("http://localhost:5000/api/Login",
      {method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
     });

     //Convert received data objects to json string. First let it web send data. so we use await
     const data = await response.json();

     if (data.Permission === 1) {
        // Admin or HR
        if (data.role.toLowerCase() === "admin") navigate("/dashboardAdmin");
        else if (data.role.toLowerCase() === "interviewer") navigate("/interviewer");
        else navigate("/dashboard"); 
    } 
    else if (data.Permission === 2) {
        // Staff
        localStorage.setItem("employee", JSON.stringify(data));
        navigate("/dashboardEmployee"); // Or your specific staff dashboard path
    }
     else alert(data.message);
     
    }
    catch(error){
      console.log("Error from LoginPage.jsx",error)
    }
  };
  const sampleData = [
            ["admin@workforce.com", "admin123", "Admin", "Male"],
            ["ceo@workforce.com", "ceo999", "CEO", "Female"],
            ["hr@workforce.com", "hr_secure", "HR", "Male"],
            ["interview@workforce.com", "test456", "interviewer", "Female"],
            ["sales@workforce.com", "sales789", "Sales manager", "Male"],
            ["intern@workforce.com", "internship", "Intern", "Female"],
            ["design@workforce.com", "creative01", "Designer", "Male"],
            ["dev@workforce.com", "coder99", "Developer", "Female"],
            ["marketing@workforce.com", "promo2025", "Marketing", "Male"],
            ["qa@workforce.com", "bugfree", "Tester", "Female"],
            ["finance@workforce.com", "money123", "Finance", "Male"],
            ["support@workforce.com", "helpdesk", "Support", "Female"]]
    
  console.log(sampleData);
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
              onClick={() => {
                setSelectedRole(role.id);}}
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
