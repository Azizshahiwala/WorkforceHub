// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function AdminSidebar({ darkMode }) {
  return (
    
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <ul>
        <h2
        style={
          {
            
          color: darkMode ? "#ffffff" : "#000000"
        }}
      >
      </h2>
        <li>
          <NavLink
                to="/dashboardEmployee"
                className={({ isActive }) =>
                    "sidebar-item" + (isActive ? " active" : "")
                }
                >
                Employee Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardEmployee/applyLeave" className="sidebar-item">
            Apply Leave
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardEmployee/performanceEmployee" className="sidebar-item">
            Check My Performance
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardEmployee/announcements" className="sidebar-item">
            Announcements
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
