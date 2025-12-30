import React, { useEffect, useState } from "react";

function EmployeeDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedEmployee");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <h1>No user logged in</h1>;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Role: {user.role}</p>
      <p>Gender: {user.gender}</p>
      <p>Department: {user.department}</p>
    </div>
  );
}

export default EmployeeDashboard;
