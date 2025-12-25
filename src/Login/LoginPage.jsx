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

     if(data.success){
        console.log("Credentials matched: "+data.role)
        if(toString(data.role) === "interviewer" ) navigate("/dashboard/interviewer");
        else navigate("/dashboard"); // HR/Admin/Employees dashboard
     }
     else alert(data.message);
     
    }
    catch(error){
      console.log("Error from LoginPage.jsx",error)
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
