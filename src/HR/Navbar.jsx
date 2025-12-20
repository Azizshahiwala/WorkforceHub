import logo from "../images/logo.jpeg";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo" />

      <button
        className="theme-toggle"
        onClick={() => setDarkMode(prev => !prev)}
      >
        <span className="icon">
          {darkMode ? "🌙" : "☀️"}
        </span>
        <span className="label">
          {darkMode ? "Dark" : "Light"}
        </span>
      </button>
    </div>
  );
}

export default Navbar;
