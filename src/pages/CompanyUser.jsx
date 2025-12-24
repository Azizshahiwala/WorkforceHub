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

// 1. Initial Data
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

export const Employees = [
  { id: 1, name: "Marshall Nichols", employeeId: "LA-0011", department: "Developer", status: "Logged In", lastLogin: "2025-12-21 09:15 AM", gender: "Male" },
  { id: 2, name: "Maryam Amiri", employeeId: "LA-0012", department: "Sales", status: "Logged In", lastLogin: "2025-12-21 08:45 AM", gender: "Male" },
  { id: 3, name: "Gary Camara", employeeId: "LA-0013", department: "Marketing", status: "Logged In", lastLogin: "2025-12-21 10:20 AM", gender: "Male" },
  { id: 4, name: "Frank Camly", employeeId: "LA-0014", department: "Testers", status: "Logged In", lastLogin: "2025-12-21 09:00 AM", gender: "Male" },
  { id: 5, name: "Aarav Mehta", employeeId: "LA-0015", department: "Intern", status: "Logged In", lastLogin: "2025-12-21 11:45 AM", gender: "Male" },
  { id: 6, name: "Sophia Turner", employeeId: "LA-0016", department: "Finance", status: "Logged Out", lastLogin: "2025-12-21 02:30 PM", gender: "Female" },
  { id: 7, name: "Daniel Roberts", employeeId: "LA-0017", department: "Developer", status: "Logged Out", lastLogin: "2025-12-20 05:00 PM", gender: "Male" },
  { id: 8, name: "Priya Sharma", employeeId: "LA-0018", department: "Support", status: "Logged In", lastLogin: "2025-12-20 09:00 AM", gender: "Female" },
  { id: 9, name: "Michael Chen", employeeId: "LA-0019", department: "Marketing", status: "Logged Out", lastLogin: "2025-12-19 06:10 PM", gender: "Male" },
  { id: 10, name: "Olivia Brown", employeeId: "LA-0020", department: "Sales", status: "Logged In", lastLogin: "2025-12-25 09:00 AM", gender: "Female" }
];

// 2. Main Component
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0011",
    department: "Developer",
    status: "Logged In",
    lastLogin: "2025-12-21 09:15 AM",
    Gender: "Male",
  },
  {
    id: 2,
    name: "Maryam Amiri",
    employeeId: "LA-0012",
    department: "Sales",
    status: "Logged In",
    lastLogin: "2025-12-21 08:45 AM",
    Gender: "Female",
  },
  {
    id: 3,
    name: "Gary Camara",
    employeeId: "LA-0013",
    department: "Marketing",
    status: "Logged In",
    lastLogin: "2025-12-21 10:20 AM",
    Gender: "Male",
  },
  {
    id: 4,
    name: "Frank Camly",
    employeeId: "LA-0014",
    department: "Testers",
    status: "Logged In",
    lastLogin: "2025-12-21 09:00 AM",
    Gender: "Male",
  },
  {
    id: 5,
    name: "Aarav Mehta",
    employeeId: "LA-0015",
    department: "Intern",
    status: "Logged In",
    lastLogin: "2025-12-21 11:45 AM",
    Gender: "Male",
  },
];

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
    return saved ? JSON.parse(saved) : Employees;
  });

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    gender: ""
  });

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const generateEmployeeId = () => {
    const lastNum = employees.length > 0 
      ? Number(employees[employees.length - 1].employeeId.split("-")[1]) 
      : 10;
    return `LA-${lastNum + 1}`;
  };

  const submitEmployee = () => {
    const { name, department, gender } = newEmployee;
    if (!name || !department) return alert("Fill all fields");

    const newEmp = {
      id: Date.now(),
      name,
      department,
      gender: gender || "Not Specified",
      employeeId: generateEmployeeId(),
      status: "Active",
      lastLogin: "Never"
    };

    const updated = [...employees, newEmp];
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
    setNewEmployee({ name: "", department: "", gender: "" });
    setShowModal(false);
  };

  const removeEmployee = (id) => {
    if (window.confirm("Remove this employee?")) {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
  };

  // Chart Logic
  const staffCount = employees.filter(emp => emp.department !== "Admin" && emp.department !== "CEO").length;
  const nonStaffCount = employees.length - staffCount;
  const pieData = {
    labels: ["Staff", "Non-Staff"],
    datasets: [{ data: [staffCount, nonStaffCount], backgroundColor: ["#47B39C", "#EC6B56"] }],
  };

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : Employees;
  });

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [newEmployee, setNewEmployee] = useState({
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

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search by name...🔍"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
          type="text"
          placeholder="Search by name... 🔍"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="emp-summary">
        <div className="pie-wrapper">
          <Pie data={pieData} />
          <div className="pie-center-text">
            <span>Total</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
        <div className="emp-legend">
          <div className="legend-item"><span className="dot staff"></span><span>Staff</span><strong>{staffCount}</strong></div>
          <div className="legend-item"><span className="dot nonstaff"></span><span>Non-Staff</span><strong>{nonStaffCount}</strong></div>
        </div>
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

      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
          <button onClick={() => setShowModal(true)}>+ NEW</button>
        </div>

        <div className="emp-grid">
          {employees
            .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
            .map((emp) => (
              <div className="emp-card" key={emp.id}>
                <button className="remove-icon-btn" onClick={() => removeEmployee(emp.id)}>✖</button>
                <div className="emp-card-row"><span>ID:</span><strong>{emp.employeeId}</strong></div>
                <div className="emp-card-row"><span>Name:</span><strong>{emp.name}</strong></div>
                <div className="emp-card-row"><span>Dept:</span><strong>{emp.department}</strong></div>
                <div className="emp-card-row"><span>Gender:</span><strong>{emp.gender}</strong></div>
              </div>
        {/* ✅ Grid instead of invalid table */}
        <div className="emp-grid">
          {employees
            .filter((emp) =>
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
                  <strong>{emp.Gender}</strong>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Employee</h3>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="department" placeholder="Department" onChange={handleChange} />
            <input type="text" name="gender" placeholder="Gender" onChange={handleChange} />
            <div className="modal-actions">
              <button onClick={submitEmployee}>Add</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
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

// 3. UserInfo Export (Place this OUTSIDE the CompanyUser function)
export function UserInfo(empID, name, lastLogin) {
  return (
    <tr key={empID}>
      <td>{empID}</td>
      <td>{name}</td>
      <td>{lastLogin}</td>
    </tr>
  );
}

export default CompanyUser;