// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function EmpSidebar({ darkMode, sidebarOpen, setSidebarOpen }) {
  const User = JSON.parse(localStorage.getItem("MySession"));
  const displayName = User ? User.name : "User";

  const handleNav = () => {
    setSidebarOpen(false);
  };
  return (

    <div className={`sidebar ${darkMode ? "dark" : ""} ${sidebarOpen ? "sidebar-open" : ""}`}>
      <ul>
        <h2 style={{ color: darkMode ? "#ffffff" : "#000000" }}>Hello, {displayName}</h2>
        <li><NavLink to="/dashboardEmployee" className={({ isActive }) => "sidebar-item" + (isActive ? " active" : "")} onClick={handleNav}>Employee Dashboard</NavLink></li>
        <li>
          <NavLink to="/dashboardEmployee/applyLeave" className="sidebar-item">
            Apply Leave
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardEmployee/assignedTaskByHR" className="sidebar-item">
            Check Assigned Task
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardEmployee/activityEmployee" className="sidebar-item">
            Check Activity
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default EmpSidebar;
