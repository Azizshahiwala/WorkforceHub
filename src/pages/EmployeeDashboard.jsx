import {React,useState,useEffect} from 'react'

function EmployeeDashboard() {
 const [employee, setEmployees]= useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });
  const loadUser = async () => {
    try {
      //Get response into 'response'
      const response = await fetch("http://localhost:5000/api/getCompanyUsers");
      //convert response to json
      const data = await response.json();
      setEmployees(data)
    } catch (error) {
      console.error("Error from CompanyUser.jsx:", error);
    }
  };
  useEffect(() => {
    //This useEffect loads Users from database CompanyUser once
    loadUser(); }
, []);
  const loggedInEmployee = employees.find(
    (emp) => emp.status === "Logged In"
  );
  return (
    <div>
      {loggedInEmployee ? (
        <h1>Welcome {loggedInEmployee.name}</h1>
      ) : (
        <h1>No user logged in</h1>
      )}
    </div>
  )
}

export default EmployeeDashboard