import React, { useState } from "react";
import "./CompanyUser.css";

const data = [
  { id: 1, name: "Marshall Nichols", employeeId: "LA-11", department: "Developer" },
  { id: 2, name: "Maryam Amiri", employeeId: "LA-12", department: "Sales" },
  { id: 3, name: "Gary Camara", employeeId: "LA-13", department: "Marketing" },
  { id: 4, name: "Frank Camly", employeeId: "LA-14", department: "Testers" },
  { id: 5, name: "Aarav Mehta", employeeId: "LA-15", department: "Intern" },
  { id: 6, name: "Sophia Turner", employeeId: "LA-16", department: "Finance" },
  { id: 7, name: "Daniel Roberts", employeeId: "LA-17", department: "Developer" },
  { id: 8, name: "Priya Sharma", employeeId: "LA-18", department: "Support" },
  { id: 9, name: "Michael Chen", employeeId: "LA-19", department: "Marketing" },
  { id: 10, name: "Olivia Brown", employeeId: "LA-20", department: "Sales" }
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
                  <strong>Active</strong>
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
