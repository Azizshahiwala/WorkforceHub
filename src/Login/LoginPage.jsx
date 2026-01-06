import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Link } from "react-router-dom";
export default function AccountLogin() {
  function clearLocalStorage(){

  }
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
