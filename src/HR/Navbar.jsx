import logo from "../images/logo.jpeg";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo" />

      {/* RIGHT SIDE: bell + theme toggle */}
      <div className="nav-right">
        <button className="bell-btn">
          <i
            className="fa-regular fa-bell"
            style={{ color: darkMode ? "#ffffff" : "#444444" }}
          ></i>
          
        </button>

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
    </div>
  );
}
export default Navbar;