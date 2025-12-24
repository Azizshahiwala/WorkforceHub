import React, { useState } from "react";
import "./CompanyUser.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = [
   { id: 1, name: "Marshall Nichols", employeeId: "LA-11", department: "Developer", gender: "Male" },
  { id: 2, name: "Maryam Amiri", employeeId: "LA-12", department: "Sales", gender: "Female" },
  { id: 3, name: "Gary Camara", employeeId: "LA-13", department: "Marketing", gender: "Male" },
  { id: 4, name: "Frank Camly", employeeId: "LA-14", department: "Testers", gender: "Male" },
  { id: 5, name: "Aarav Mehta", employeeId: "LA-15", department: "Intern", gender: "Male" },
  { id: 6, name: "Sophia Turner", employeeId: "LA-16", department: "Finance", gender: "Female" },
  { id: 7, name: "Daniel Roberts", employeeId: "LA-17", department: "Developer", gender: "Male" },
  { id: 8, name: "Priya Sharma", employeeId: "LA-18", department: "Support", gender: "Female" },
  { id: 9, name: "Michael Chen", employeeId: "LA-19", department: "Marketing", gender: "Male" },
  { id: 10, name: "Olivia Brown", employeeId: "LA-20", department: "Sales", gender: "Female" },
  { id: 11, name: "Robert Williams", employeeId: "LA-21", department: "Admin", gender: "Male" },
  { id: 12, name: "Ananya Kapoor", employeeId: "LA-22", department: "CEO", gender: "Female" }
];

function CompanyUser() {
  const [employees, setEmployees] = useState(()=>{
    const saved = localStorage.getItem("employees");
    // JSON.parse => Converts a JSON string back into a JavaScript object
    return saved ? JSON.parse(saved) : data;
  });

  const [showModal, setShowModal] = useState(false);
  // Search
  const [search,setSearch]= useState("");

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // previous state
    setNewEmployee((prev) => ({
      ...prev,  //copy existing fields
      [name]: value  //update only the field you typed in
    }));
  };

  // 👉 generate next ID like LA-0021
  const generateEmployeeId = () => {
    const lastEmp = employees[employees.length - 1];
    const lastNum = lastEmp
      ? Number(lastEmp.employeeId.split("-")[1])
      : 0;

    return `LA-${lastNum + 1}`;
  };

  const submitEmployee = () => {
    const name = newEmployee.name.trim();
    const dept = newEmployee.department.trim();

    if (!name || !dept) {
      alert("Please fill all fields");
      return;
    }

    const newEmp = {
      id: employees.length + 1,
      name,
      department: dept,
      employeeId: generateEmployeeId()
    };

    setEmployees((prev) => {
      const updated = [...prev, newEmp] // ...prev => keeps old values
      // JSON.stringigy => Converts a JavaScript object into a JSON string
      localStorage.setItem("employees", JSON.stringify(updated));
      return updated;
    });
    setNewEmployee({ name: "", department: "" });
    setShowModal(false);
  };

  // Remove Employee
  const removeEmployee = (id) => {
   if (window.confirm("Are you sure you want to remove this employee?")) {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
  };

  // Reset the data if deleted 
  // const resetEmployees = () => {
  //   localStorage.removeItem("employees");
  //   setEmployees(data);
  // };

  // ===============================
  // 📊 Pie Chart Logic
  // Staff = all except Admin & CEO
  // Non-Staff = Admin + CEO
  // ===============================
  const staffCount = employees.filter(
    emp => emp.department !== "Admin" && emp.department !== "CEO"
  ).length;

  const nonStaffCount = employees.filter(
    emp => emp.department === "Admin" || emp.department === "CEO"
  ).length;

  const pieData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [
      {
        data: [staffCount, nonStaffCount],
        backgroundColor: ["#47B39C", "#EC6B56"], // green & red
        borderWidth: 1,
      },
    ],
  };

  return (
    
    <div className="leave-page">
      <div className="leave-header">
        <h2>Users</h2>
        {/* Reset the data if deleted */}
        {/* <button type="button" onClick={resetEmployees}>
          Reset
        </button> */}
        <input
            type="text"
            placeholder="Search by name...🔍"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
      </div>

       {/* ================= Pie Chart ================= */}
      {/* <div className="pie-wrapper">
        <Pie data={pieData} />
        <div className="pie-center-text">
          <div>Total</div>
          <strong>{employees.length}</strong>
        </div>
      </div> */}
      {/* ================= Employee Summary ================= */}
<div className="emp-summary">
  <div className="pie-wrapper">
    <Pie data={pieData} />
    <div className="pie-center-text">
      <span>Total</span>
      <strong>{employees.length}</strong>
    </div>
  </div>

  {/* 👇 Staff / Non-Staff Info */}
  <div className="emp-legend">
    <div className="legend-item">
      <span className="dot staff"></span>
      <span>Staff</span>
      <strong>{staffCount}</strong>
    </div>
    <div className="legend-item">
      <span className="dot nonstaff"></span>
      <span>Non-Staff</span>
      <strong>{nonStaffCount}</strong>
    </div>
  </div>
</div>


      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
          <button type="button" onClick={() => setShowModal(true)}>
            + NEW
          </button>
        </div>

        <table className="leave-table">
          <>
          <div className="emp-grid">
          {employees
            .filter(emp =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <div className="emp-card" key={emp.id}>
                <button
                  className="remove-icon-btn"
                  onClick={() => removeEmployee(emp.id)}
                >
                  ✖
                </button>

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
                  <strong className="status-active">Active</strong>
                </div>
                <div className="emp-card-row">
                  <span>Gender:</span>
                  <strong>{emp.gender}</strong>
                </div>
              </div>
            ))}
        </div>
          </>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Add New Employee</h3>

              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={newEmployee.name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newEmployee.department}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="button" onClick={submitEmployee}>
                  Add
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyUser;
