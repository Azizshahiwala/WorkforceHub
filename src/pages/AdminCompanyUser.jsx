import React, { useState,useEffect } from "react";
import "./CompanyUser.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

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
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });


useEffect(() => {
    //This useEffect loads Users from database CompanyUser once
    const loadUser=async()=>{
      try {
        //Get response into 'response'
          const response=await(fetch("http://localhost:5000/api/getCompanyUsers"));
        //convert response to json
        const data=await response.json();
        setEmployees(data)
      } catch (error) {
        console.error("Error from CompanyUser.jsx:", error);
      }};
    loadUser(); }, []);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [ , setNewEmployee] = useState({
    name: "",
    department: "",
    Gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateEmployeeId = () => {
    const lastEmp = employees[employees.length - 1];
    const lastNum = lastEmp
      ? Number(lastEmp.employeeId.split("-")[1])
      : 10;
    return `LA-${String(lastNum + 1).padStart(4, "0")}`;
  };

  const submitEmployee = () => {
    const { name, department, Gender } = newEmployee;
    if (!name || !department || !Gender) {
      alert("Please fill all fields");
      return;
    }

    const newEmp = {
      id: employees.length + 1,
      name,
      department,
      Gender,
      employeeId: generateEmployeeId(),
      status: "Logged In",
      lastLogin: new Date().toLocaleString(),
    };

    const updated = [...employees, newEmp];
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));

    setNewEmployee({ name: "", department: "", Gender: "" });
    setShowModal(false);
  };

  const removeEmployee = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      const updated = employees.filter((emp) => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
  };

  const staffCount = employees.filter(
    (emp) => emp.department !== "Admin" && emp.department !== "CEO"
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

  const resetEmployees = () => {
  localStorage.removeItem("employees");   // 👈 this line (you add)
  setEmployees(Employees);
};

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Users</h2>
        <button type="button" className="reset-btn " onClick={resetEmployees}>Reset Data</button>
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
          <button type="button" onClick={() => setShowModal(true)}>
            + NEW
          </button>
        </div>

        {/* ✅ Grid instead of invalid table */}
        <div className="emp-grid">
          {employees
            .filter((emp) =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <div className="emp-card" key={emp.employeeId}>
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
                  <strong>{emp.Gender}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Last Login:</span>
                  <strong>{emp.lastLogin}</strong>
                </div>
              </div>
            ))}
        </div>

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

              <input
                type="text"
                name="Gender"
                placeholder="Gender"
                value={newEmployee.Gender}
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