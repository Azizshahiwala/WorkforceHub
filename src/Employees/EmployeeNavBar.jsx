import logo from "../images/logo.jpeg";
import Logout from "../Misc/Logout";
import NotificationSystem from "../Misc/NotificationPanel";
import "../HR/Navbar.css";
import { useState, useEffect, useRef } from "react";

function Navbar({ darkMode, setDarkMode ,session}) {
  const [RedDot, SetRedDot] = useState(false);
  const audioRef = useRef(null);

  const [notifWindow, setnotifWindow] = useState(false);
  
  // Notification bell logic and Sound Logic
  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");

    const checkNotification = () => {
      if (
        localStorage.getItem("hasNewNotification") === "true" &&
        !RedDot
      ) {
        SetRedDot(true);
        audioRef.current?.play();
      }
    };

    checkNotification();
    window.addEventListener("focus", checkNotification);

    return () => window.removeEventListener("focus", checkNotification);
  }, [RedDot]);

  const clearNotification = () => {
    SetRedDot(false);
    localStorage.removeItem("hasNewNotification");
  };
  const togglePanel = (e) => {
    e.stopPropagation();
    setnotifWindow(!notifWindow);
    clearNotification();
  };

  return (
    <div className="navbar">
      <img src={logo} alt="HRMS Logo" className="logo" />

      <div className="notification-wrapper" onClick={togglePanel}>
        <button className="bell-btn">
          <i
            className="fa-regular fa-bell"
            style={{ color: darkMode ? "#ffffff" : "#444444" }}
          ></i>
          {RedDot && <span className="notification-dot"></span>}
        </button>
      </div>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode(prev => !prev)}
      >
        <span className="icon">{darkMode ? "🌙" : "☀️"}</span>
        <span className="label">{darkMode ? "Dark" : "Light"}</span>
      </button>

      <Logout SessionName={"MySession"} />
      {notifWindow && (
          <div className="notification-dropdown">
            <NotificationSystem session={session} />
          </div>
        )}
    </div>
  );
}

export default Navbar;
