import logo from "../images/logo.jpeg";
import "../HR/Navbar.css";
import { useState, useEffect,useRef } from "react";

function Navbar({ darkMode, setDarkMode }) {

   const [hasNotification, setHasNotification] = useState(false);
  useEffect(() => {
  const audio = new Audio("/notification.wav");

  // show dot if already exists 
  if (localStorage.getItem("hasNewNotification") === "true") {
    setHasNotification(true);
  }

  const handleStorageChange = (event) => {
    if (event.key === "activities") {
      setHasNotification(true);
      audio.play().catch(() => {});
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };

  
}, []);

const clearNotification = () => {
    new Audio("/notification.mp3").play();
    setHasNotification(false);
    localStorage.setItem("hasNewNotification", "false");
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
           {hasNotification && <span className="notification-dot"></span>}
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