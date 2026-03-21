// layout/HRLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../HR/Navbar";
import Sidebar from "../HR/Sidebar";
import "./HRLayout.css";
import { useState, useEffect } from "react";
import MessageBox from "../Misc/MessageBox";

function HRLayout() {
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  const [message, setMessage] = useState(null);
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

  if (!MySession || !MySession?.permission === 1) {
    setMessage({ type: "Error", text: "You do not have permission to visit this content. Please Login." });
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <MessageBox message={message} onClose={() => setMessage(null)} />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} session={MySession} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
