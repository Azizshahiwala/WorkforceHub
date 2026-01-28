import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Link } from "react-router-dom";
export default function AccountLogin() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //This useeffect handles tab close logout.
  useEffect(()=>{
    const handleClose = () => {
      const currentSession = JSON.parse(localStorage.getItem("MySession"));
      
      
      //Check if session exist and EmployeeId.
      //This targets specific user.
      if (currentSession) {
        //Get url which updates session to log out
      const url = `${API_BASE_URL}/TabCloseLogout/${currentSession.employeeId}`;
        //this is a browser API. which runs before tab close. 
        //Inshort,  WHEH tab close, send request to backend to update session status to logout.
        navigator.sendBeacon(url);
      }
    };
    //After column is updated, now trigger the event listener.
    window.addEventListener("beforeunload", handleClose);
    //For safety, remove eventlistener.
    return () => {
      window.removeEventListener("beforeunload", handleClose);
    };
  },[API_BASE_URL]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/Login`, {
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
      const userSession = {
            employeeId: data.employeeId,
            auth_id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            permission: data.Permission,
            status: data.status
          }
      
          localStorage.setItem("MySession",JSON.stringify(userSession));
      // staff (EMPLOYEE)
      if (data.Permission === 2 || data.Permission === 3) {  
        navigate("/dashboardEmployee");
      }
      // nonstaff (HR / ADMIN / CEO / INTERVIEWER)
      else if (data.Permission === 1) {
        if (data.role.toLowerCase() === "hr") {
          navigate("/dashboard");
        } else if (data.role.toLowerCase() === "admin" || data.role.toLowerCase() === "ceo") {
          navigate("/dashboardAdmin");
        } else {
          navigate("/interviewer");
        }
      } else {
        alert(data.message);
        return;
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
          <Link className="Register-Employee" to="/RegisterForm">Click here to register if you're new here</Link>
        </form>
      </div>
    </div>
  );
}
