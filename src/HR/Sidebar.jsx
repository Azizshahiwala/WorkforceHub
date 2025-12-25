// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function Sidebar({ darkMode }) {
  return (
    
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <ul>
        <li>
          <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    "sidebar-item" + (isActive ? " active" : "")
                }
                >
                HR Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/users" className="sidebar-item">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/leave" className="sidebar-item">
            Leave Manager
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/applications" className="sidebar-item">
            Applications
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/attendance" className="sidebar-item">
            Employee Attendance
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/payroll" className="sidebar-item">
            PayRoll
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/activity" className="sidebar-item">
            Activity
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/feedback" className="sidebar-item">
            Feedback to Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/performance" className="sidebar-item">
            Employee Performance
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
