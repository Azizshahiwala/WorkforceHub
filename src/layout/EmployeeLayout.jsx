// layout/EmployeeLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Employees/EmployeeNavBar";
import Sidebar from "../Employees/EmployeeSidebar";
import "./AdminLayout.css";
import { useState,useEffect} from "react";
import MessageBox from "../Misc/MessageBox";
import { Navigate } from "react-router-dom";
function EmployeeLayout() {
  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  const isAuthorized = MySession?.permission === 2 || MySession?.permission === 3;

  const [darkMode, setDarkMode] = useState(()=>{
    return localStorage.getItem("theme") === "dark"
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
  
  if (!MySession || !isAuthorized) {
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

export default EmployeeLayout;
