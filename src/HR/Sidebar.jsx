// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function Sidebar({ darkMode }) {
  return (
    
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <ul>
        <h2
        style={
          {
            
          color: darkMode ? "#ffffff" : "#000000"
        }}
      >
        Hello HR
      </h2>
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
          <NavLink to="/dashboard/Applications" className="sidebar-item">
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
          <NavLink to="/dashboard/EmployeePerformance" className="sidebar-item">
            Employee Performance
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
