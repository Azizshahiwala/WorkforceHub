import logo from "../images/logo.jpeg";
import "../HR/Navbar.css";
import { useState, useEffect,useRef } from "react";

function Navbar({ darkMode, setDarkMode }) {

  const [Notifs, setNotifs] = useState([]);
  const [RedDot, SetRedDot] = useState(false);
  
  const audio = new Audio("/notification.wav");
const clearNotification = () => {
    new Audio("/notification.mp3").play();
  };

  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo" />

      {/* RIGHT SIDE: bell + theme toggle */}
      <div className="notification-wrapper" onClick={clearNotification}>
        <button className="bell-btn">
          <i
            className="fa-regular fa-bell"
            style={{ color: darkMode ? "#ffffff" : "#444444" }}
          ></i>
           {RedDot && <span className="notification-dot"></span>}
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