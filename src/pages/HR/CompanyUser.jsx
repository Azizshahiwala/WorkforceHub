import React, { useState,useEffect } from "react";
import "../../styles/HR/CompanyUser.css";
import { Navigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import MessageBox from "../../Misc/MessageBox";
ChartJS.register(ArcElement, Tooltip, Legend);
export function UserInfo(empID, name, lastLogin) {
    return (
        <tr key={empID}>
            <td>{empID}</td>
            <td>{name}</td>
            <td>{lastLogin}</td>
        </tr>
    );
}

function CompanyUser() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [message, setMessage] = useState(null);
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    //This useEffect loads Users from database CompanyUser once
    const loadUser = async () => {
      try {
        //Get response into 'response'
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`,{method: 'GET',
  credentials: 'include'});
        //convert response to json
        const data = await response.json();
        setEmployees(data)
      } catch (error) {
        console.error("Error from CompanyUser.jsx:", error);
      }
    };
    loadUser(); }, []);
  
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tempPass, setTempPass] = useState("");
  const [tempID, settempID] = useState("");
  
  const setData = (auth_id) => {
    settempID(auth_id);
    setShowModal(true);
  } 
  const clearData = () => {
    settempID("");
    setTempPass("");
    setShowModal(false);
  } 
  const submitEmployee = () => {
    
    fetch(`${API_BASE_URL}/updatePassByHR/${tempID}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({tempPass})
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        setMessage({ type: "Success", text: data.message});
        <Navigate to="/dashboard/users" replace></Navigate>
      } else {
        setMessage({ type: "Error", text: data.message});
      }
    })
    .catch(err => {setMessage({ type: "Error", text: err});});
    setTempPass("");
    setShowModal(false);
  };

  const deleteAccount = async (auth_id,role,employeeId) => {
    if(auth_id == "undefined" || role == "undefined" || employeeId == "undefined"){
      setMessage({ type: "Error", text: "Un-identified attempt to remove an account"});
      return;
    }
    try {
      if (window.confirm("Are you sure you want to remove this account?")) {

        const response = await fetch(`${API_BASE_URL}/deleteAccount/${auth_id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({auth_id,role,employeeId}),
      });
        const data = await response.json();
        if (response.ok) {
          const updated = employees.filter((emp) => emp.auth_id !== auth_id);
          setEmployees(updated);
          setMessage({ type: "Success", text: data.message});
        } 
        else{
          setMessage({ type: "Error", text: data.message});
        }
      }
    } catch (error) {
      setMessage({ type: "Error", text: "Cannot remove Employee: ", error});
    }
  };

  const staffCount = employees.filter(
    (emp) => emp.department !== "Admin" && 
    emp.department !== "CEO" && 
    emp.department !== "HR" && 
    emp.department !== "HR" && 
    emp.department !== "Interviewer"
  ).length;

  const nonStaffCount = employees.length - staffCount;

  const pieData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [
      {
        data: [staffCount, nonStaffCount],
        backgroundColor: ["#47B39C", "#EC6B56"],
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="leave-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
      <div className="leave-header">
        <h2>Users</h2>
       </div>

      <div className="emp-summary">
        <div className="pie-wrapper">
          <Pie data={pieData} />
          <div className="pie-center-text">
            <span>Total</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
      </div>

      <input
          type="text"
          placeholder="Search by name... 🔍"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      
      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
        </div>

        {/* ✅ Grid instead of invalid table */}
        <div className="emp-grid">
          {employees
            .filter((emp) =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <div className="emp-card" key={emp.auth_id}>
                <button
                  className="remove-icon-btn"
                  onClick={() => deleteAccount(emp.auth_id,emp.role,emp.employeeId)}
                >
                  ✖
                </button>
                {/**This condition checks if status is just admitted. Then only it puts a change pass btn */}
                {emp.status === "Just admitted" && 
                <div className="emp-card-row">
                  <button type="button" onClick={() => setData(emp.auth_id)}>
                  <strong>Update Password</strong>
                  </button>
                </div>}
                <div className="emp-card-row">
                  <span>Employee ID:</span>
                  <strong>{emp.employeeId}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Name:</span>
                  <strong>{emp.name}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Department:</span>
                  <strong>{emp.department}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Status:</span>
                  {emp.status?.toLowerCase() === "logged in" ? <strong className="status-active">Active</strong> : 
                  <strong className="status-inactive">In-active</strong>}
                  </div>
                <div className="emp-card-row">
                  <span>Gender:</span>
                  <strong>{emp.gender}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Last Login:</span>
                  <strong>{emp.lastLogin}</strong>
                </div>
              </div>
            ))}
        </div>

        {showModal && (
          <form onSubmit={() => submitEmployee(tempPass)}>
          <div className="modal-overlay">
            <div className="modal-box">
              <input
                type="password"
                name="UIpassword"
                placeholder="Enter password"
                value={tempPass}
                onChange={(e) => setTempPass(e.target.value)}
                />
              <div className="emp-card-row" style={{color : "red"}}>
                Note: when password is changed, this will
                be notified to the corresponding user {employees.name},
                and you will no longer be able to change this again.
                Only the user will be able to re-set its password
              </div>
              <div className="modal-actions">
                
                <button type="submit">
                  Notify
                </button>
                <button type="button" onClick={() => clearData()}>
                  Close
                </button>
              </div>
            </div>   
          </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CompanyUser;