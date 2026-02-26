// layout/HRLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../HR/Navbar";
import Sidebar from "../HR/Sidebar";
import "./HRLayout.css";
import { useState,useEffect, Children } from "react";

function HRLayout() {
  
  const MySession = JSON.parse(localStorage.getItem("MySession"));

  if (!MySession || MySession.permission !== 1) {
    alert("You do not have permission to visit this content.");
    return <Navigate to="/" replace />;
  }
  
  const [darkMode, setDarkMode] = useState(()=>{
    localStorage.getItem("theme") === "dark"
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} session={MySession}/>
      <div className="layout-body">
        <Sidebar darkMode={darkMode}/>
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default HRLayout;
