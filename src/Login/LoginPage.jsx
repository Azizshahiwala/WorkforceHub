import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Link } from "react-router-dom";
export default function AccountLogin() {
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

      if (!data || data.Permission === 0) {
        alert("Invalid login response");
        return;
      }
      const userSession = JSON.stringify({
            employeeId: data.employeeId,
            name: data.name,
            email: data.email,
            role: data.role,
          })
      // staff (EMPLOYEE)
      if (data.Permission === 2 || data.Permission === 3) {
        localStorage.setItem("loggedInEmployee",userSession);
        navigate("/dashboardEmployee");
      }
      // nonstaff (HR / ADMIN / CEO / INTERVIEWER)
      else if (data.Permission === 1) {
    
        if (data.role.toLowerCase() === "hr") {
          localStorage.setItem("loggedInHR", userSession);
          navigate("/dashboard");
        } else if (data.role.toLowerCase() === "admin" || data.role.toLowerCase() === "ceo") {
          localStorage.setItem("loggedInAdmin", userSession);
          navigate("/dashboardAdmin");
        } else {
          navigate("/interviewer");
        }
      } else {
        alert(userSession);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="title">Login with your account</h2>
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
          <Link to="/RegisterForm">Click here to register if you're new here</Link>
        </form>
      </div>
    </div>
  );
}
