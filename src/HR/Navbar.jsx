// components/Navbar.jsx
import logo from '../Image/logo.jpeg';
function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo"  />
      <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
      >
        <span className="icon">
          {darkMode ? "🌙" : "☀️"}
        </span>
        <span className="label">
          {darkMode ? "Dark" : "Light"}
        </span>
      </button>
      {/* nav links, profile, etc */}
    </div>
  );
}

export default Navbar;