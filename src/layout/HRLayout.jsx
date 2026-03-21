import { Outlet } from "react-router-dom";
import Navbar from "../HR/Navbar";
import Sidebar from "../HR/Sidebar";
import "./HRLayout.css";
import { useState, useEffect } from "react";

function HRLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className="layout-body">
        <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default HRLayout;