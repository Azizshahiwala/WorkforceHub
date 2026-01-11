// layout/EmployeeLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Employees/EmployeeNavBar";
import Sidebar from "../Employees/EmployeeSidebar";
import "./AdminLayout.css";
import { useState,useEffect, Children } from "react";
function EmployeeLayout() {
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

export default EmployeeLayout;
