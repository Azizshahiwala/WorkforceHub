import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import MessageBox from '../Misc/MessageBox';
import { Link } from "react-router-dom";
export default function AccountLogin() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message,setMessage] = useState(null);
  //This useeffect handles tab close logout.
  useEffect(()=>{
    const handleClose = () => {
      
        //Get url which updates session to log out
        //everything is checked using backend flask sessions.

      const url = `${API_BASE_URL}/TabCloseLogout`;
        //this is a browser API. which runs before tab close. 
        //Inshort,  WHEH tab close, send request to backend to update session status to logout.
        navigator.sendBeacon(url);
      
    };
    //After column is updated, now trigger the event listener.
    window.addEventListener("beforeunload", handleClose);
    //For safety, remove eventlistener.
    return () => window.removeEventListener("beforeunload", handleClose);
  },[API_BASE_URL]);

  const handleNavLink = (e) => {
    e.preventDefault();
  // Encode the email to use as a 'ref' query parameter
  // If the email field is empty, it just navigates without the ref
  const refParam = email ? `?ref=${btoa(email)}` : "";
  navigate(`/ForgotPasswordPage${refParam}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Main login seed
    try {
      const response = await fetch(`${API_BASE_URL}/Login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //console.log("🔍 Login response:", data);

      if (!data || data.Permission === 0) {
        setMessage({ type: "Error", text: data.message || "Invalid credentials." });
        return;
      }
      //Now account will only be read from backend and only THEN store in session.
      const userSession = {
        employeeId: data.employeeId,
        auth_id:    data.id,
        name:       data.name,
        email:      data.email,
        role:       data.role,
        permission: data.permission,
        status:     data.status,
      };
      localStorage.setItem("MySession", JSON.stringify(userSession));

      // staff (EMPLOYEE)
      if (data.Permission === 2 || data.Permission === 3) {  
        navigate("/dashboardEmployee");
      }
      // nonstaff (HR / ADMIN / CEO / INTERVIEWER)
      else if (data.Permission === 1) {
        if (data.role.toLowerCase() === "hr") 
          navigate("/dashboard");
        else if (data.role.toLowerCase() === "admin" || data.role.toLowerCase() === "ceo") 
          navigate("/dashboardAdmin");
        else 
          navigate("/interviewer");
      } 
      else {
        setMessage({ type: "Error", text: data.message || "Unauthorized access." });
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "Error", text: "Failed to connect to server." });
    }
  };

  return (
    <div className="login-wrapper">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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
          <Link className="Register-Employee" to="/RegisterForm">Click here to register if you're new here</Link><br/>
          <Link className="Forget-nav" onClick={handleNavLink}>Forgot password?</Link>
          </form>
      </div>
    </div>
  );
}
