// layout/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Admin/AdminNavbar";
import Sidebar from "../Admin/AdminSidebar";
import "./AdminLayout.css";
import { useState,useEffect, Children } from "react";
import { Navigate } from "react-router-dom";
function AdminLayout() {

  const MySession = JSON.parse(localStorage.getItem("MySession"));
  const isAuthorized = MySession?.permission === 1
  
  // If no session or wrong permission, return the Navigate component
  if (!MySession || !isAuthorized) {
    alert("You do not have permission to visit this content. Please Login.");
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
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="layout-body">
        <Sidebar darkMode={darkMode}/>
        <main className="layout-content">
          
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
