// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink
                to="/"
                className={({ isActive }) =>
                    "sidebar-item" + (isActive ? " active" : "")
                }
                >
                HR Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className="sidebar-item">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/leave" className="sidebar-item">
            Leave Manager
          </NavLink>
        </li>
        <li>
          <NavLink to="/attendance" className="sidebar-item">
            Employee Attendance
          </NavLink>
        </li>
        <li>
          <NavLink to="/payroll" className="sidebar-item">
            PayRoll
          </NavLink>
        </li>
        <li>
          <NavLink to="/activity" className="sidebar-item">
            Activity
          </NavLink>
        </li>
        <li>
          <NavLink to="/feedback" className="sidebar-item">
            Feedback to Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/performance" className="sidebar-item">
            Employee Performance
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
