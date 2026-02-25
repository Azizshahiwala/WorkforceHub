import { useState, useEffect } from "react";
import "./NotificationPanel.css";
/*This uses a session variable which is passed from Navbar.jsx to make
this work. */
function NotificationSystem({session}) {
  const [notifications, setNotifications] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    
    if (session && session.employeeId) {
      // 2. Fetch notifications specific to this ID
      fetch(`${API_BASE_URL}/getNotifs/${session.employeeId}/${session.role}`)
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
          console.info("Session: ",session);
          
          // 3. Trigger visual cues if there are unread messages
          const hasUnread = data.some(n => n.status === "Unread");
          console.info(session.status);
          if (hasUnread) {
            localStorage.setItem("hasNewNotification", "true");
          }
          else{
            localStorage.setItem("hasNewNotification", "false");
          }
        })
        .catch((err) => console.error("Notification fetch error:", err));
    }
  }, [session]);

  const markAsRead = (id) => {
    fetch(`${API_BASE_URL}/markRead/${id}`, { method: 'POST' })
      .then(() => {
        // Update local state to reflect change without re-fetching stack
        setNotifications(prev => prev.map(n => 
          n.NotifsId === id ? { ...n, status: 'Read' } : n
        ));
      });
  };

  return (
    // Render your notification list here
    <div className="notification-stack">
      {notifications.map((n) => {
  // Logic to determine display type
  const isGlobal = n.isGlobal === 1 || n.employeeId === "All";
  const isAdminOnly = n.employeeId === "Special";

  return (
    <div 
      key={n.NotifsId} 
      className={`notif-item 
        ${isGlobal ? 'global-announcement' : ''} 
        ${isAdminOnly ? 'admin-alert' : ''} 
        ${n.status === 'Unread' ? 'unread' : ''}`}
      onClick={() => markAsRead(n.NotifsId)}>
      <div className="notif-badge-container">
        {isGlobal && <span className="badge global">📢 Global</span>}
        {isAdminOnly && <span className="badge admin">🛡️ Admin </span>}
        {!isGlobal && !isAdminOnly && <span className="badge personal">👤 Personal</span>}
      </div>

      <p className="notif-msg">{n.message}</p>
      <small className="notif-date">{n.date}</small>
    </div>
  );
})}
    </div>
  );
}
export default NotificationSystem;