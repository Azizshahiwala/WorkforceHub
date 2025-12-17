// components/Navbar.jsx
import logo from '../Image/logo.jpeg';
function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo"  />
      {/* nav links, profile, etc */}
    </div>
  );
}

export default Navbar;
