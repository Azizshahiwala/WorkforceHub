import React from 'react'
import { useNavigate } from 'react-router-dom';
function Announcements() {
  const navigate = useNavigate();
  const MySession = JSON.parse(localStorage.getItem("MySession"));
    
  return (
    <div>Announcements</div>
  )
}

export default Announcements