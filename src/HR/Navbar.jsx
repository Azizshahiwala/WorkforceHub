import logo from "../images/logo.jpeg";
import Logout from "../Misc/Logout";
import NotificationSystem from "../Misc/NotificationPanel";
import "../HR/Navbar.css";

import { useState, useEffect,useRef } from "react";

function Navbar({ darkMode, setDarkMode, session }) {

  const [RedDot, SetRedDot] = useState(false);
  const audioRef = useRef(null);

  // Notification listener for Admin activities
  const [hasNotification, setHasNotification] = useState(false);
  const [notifWindow, setnotifWindow] = useState(false);
  useEffect(() => {
    const audio = new Audio("/notification.wav");

    // show dot if already exists
    if (localStorage.getItem("hasNewNotification") === "true") {
      setHasNotification(true);
    }

    const handleStorageChange = (event) => {
      if (event.key === "hasNewNotification" && event.newValue === "true") {
        setHasNotification(true);
        audio.play().catch(() => { });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

      {/* RIGHT SIDE: bell + theme toggle */}
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
          <span className="icon">
            {darkMode ? "🌙" : "☀️"}
          </span>
          <span className="label">
            {darkMode ? "Dark" : "Light"}
          </span>
        </button>
      <Logout SessionName={"MySession"}></Logout>
      {notifWindow && (
          <div className="notification-dropdown">
            <NotificationSystem session={session} />
          </div>
        )}
    </div>
  );
}
export default Navbar;


/*Logic for notification: WHEN this page loads, check if notification localvalue 
is turned to true. IF its true, do the following:
run checkNotification once -> if localstorage is set, put a red dot on bell
run useeffect once -> if localstorage ALREADY exists, put a red dot

WHEN red dot is clicked (classname = notification-wrapper), run:
- togglePanel 
- clearNotification()

A session variable is passed from Layout to make this notifs work for unique person.

THEN, show a div tag from condition: notifWindow && <div>. THIS fetches notifications from databases.
Using both: localstorage for validation and fetching from db.
*/
