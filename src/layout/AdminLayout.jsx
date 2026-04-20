// layout/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { useHeartbeat } from "../Misc/useHeartBeat";
import Navbar from "../Admin/AdminNavbar";
import Sidebar from "../Admin/AdminSidebar";
import "./AdminLayout.css";
import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import MessageBox from "../Misc/MessageBox";
function AdminLayout() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useHeartbeat(API_BASE_URL);
  
  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const MySession = JSON.parse(localStorage.getItem("MySession"));
  const isAuthorized = MySession?.permission === 1
  
  const [darkMode, setDarkMode] = useState(()=>{
    return localStorage.getItem("theme") === "dark"
  });

  useEffect(() => {
    window._isNavigating = false; 
}, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  
  // If no session or wrong permission, return the Navigate component
  if (!MySession || !isAuthorized) {
    setMessage({ type: "Error", text: "You do not have permission to visit this content. Please Login." });
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
    {/**This message box takes 2 arguments: [type:"" , message:""] and [onClose function]
     * Where type of message is sent to messagebox.jsx along with message and a onclose function which uses a shorthand property
     * to change state to null.
     */}
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

export default AdminLayout;
