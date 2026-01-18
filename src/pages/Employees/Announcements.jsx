import React from 'react'
function Announcements() {
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  return (
    <div>Announcements</div>
  )
}

export default Announcements