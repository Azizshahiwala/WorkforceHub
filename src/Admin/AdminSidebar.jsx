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
        Hello Admin
      </h2>
        <li>
          <NavLink
                to="/dashboardAdmin"
                className={({ isActive }) =>
                    "sidebar-item" + (isActive ? " active" : "")
                }
                >
                Admin Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardAdmin/usersAdmin" className="sidebar-item">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardAdmin/activityAdmin" className="sidebar-item">
            Activity
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardAdmin/feedbackAdmin" className="sidebar-item">
            Feedback to Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboardAdmin/performanceAdmin" className="sidebar-item">
            Employee Performance
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
