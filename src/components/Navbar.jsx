// components/Navbar.jsx
import logo from '../images/logo.jpeg';
function Navbar() {
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
//Used in local storage
// const va = [

//   {id: 0, name: 'Aziz'}
//   {id: 1, name: 'Azi'}
//   {id: 2, name: 'Az'}
//   {id: 3, name: 'A'}
// ];