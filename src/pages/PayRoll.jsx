import React, { useState,useEffect } from 'react'
import './PayRoll.css';

const data = [
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0011",
    phone: "+91 9876543210",
    joinDate: "2022-03-15",
    role: "Senior Developer",
    salary: 85000
  },
  {
    id: 2,
    name: "Maryam Amiri",
    employeeId: "LA-0012",
    phone: "+91 9876543211",
    joinDate: "2021-07-10",
    role: "Sales Executive",
    salary: 60000
  },
  {
    id: 3,
    name: "Gary Camara",
    employeeId: "LA-0013",
    phone: "+91 9876543212",
    joinDate: "2023-01-20",
    role: "Marketing Manager",
    salary: 70000
  },
  {
    id: 4,
    name: "Frank Camly",
    employeeId: "LA-0014",
    phone: "+91 9876543213",
    joinDate: "2020-11-05",
    role: "QA Tester",
    salary: 55000
  },
  {
    id: 5,
    name: "Aarav Mehta",
    employeeId: "LA-0015",
    phone: "+91 9876543214",
    joinDate: "2024-02-01",
    role: "Software Intern",
    salary: 20000
  },
  {
    id: 6,
    name: "Sophia Turner",
    employeeId: "LA-0016",
    phone: "+91 9876543215",
    joinDate: "2019-09-18",
    role: "Finance Analyst",
    salary: 75000
  },
  {
    id: 7,
    name: "Daniel Roberts",
    employeeId: "LA-0017",
    phone: "+91 9876543216",
    joinDate: "2022-06-30",
    role: "Frontend Developer",
    salary: 65000
  },
  {
    id: 8,
    name: "Priya Sharma",
    employeeId: "LA-0018",
    phone: "+91 9876543217",
    joinDate: "2023-08-12",
    role: "Customer Support",
    salary: 45000
  },
  {
    id: 9,
    name: "Michael Chen",
    employeeId: "LA-0019",
    phone: "+91 9876543218",
    joinDate: "2021-04-25",
    role: "Marketing Executive",
    salary: 62000
  },
  {
    id: 10,
    name: "Olivia Brown",
    employeeId: "LA-0020",
    phone: "+91 9876543219",
    joinDate: "2020-01-10",
    role: "Sales Manager",
    salary: 90000
  }
];

function PayRoll() {

  const [Employee, setEmployee] = useState(data);

  // search Employee
  const [search,setSearch]= useState("");
  
    // useEffect(() => {
    //     const saved = localStorage.getItem("employees");
    //     if (saved) {
    //       setEmployee(JSON.parse(saved));
    //     }
    //   }, []);

// (Optional) Mail handler
const displayRow = (id) => {
  alert("Mail sent to employee ID: " + id);
};

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Employee Salary</h2>
      </div>

      <div className="leave-card">
        <div className="leave-card-header">
          {/* <h3>Employee Salarys</h3> */}
          <input
            type="text"
            placeholder="Search by name...🔍"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <table className="leave-table">
          <tbody>

            {/* filter => Loop through all employees and show only those whose name contains the 
            searched text, ignoring case. */}

            <div className="emp-grid">
              {Employee
                .filter(emp =>
                  emp.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((emp) => (
                  <div className="emp-card" key={emp.id}>
                    <div className="emp-card-row">
                      <span>Employee ID:</span>
                      <strong>{emp.employeeId}</strong>
                    </div>

                    <div className="emp-card-row">
                      <span>Name:</span>
                      <strong>{emp.name}</strong>
                    </div>

                    <div className="emp-card-row">
                      <span>Phone:</span>
                      <strong>{emp.phone}</strong>
                    </div>

                    <div className="emp-card-row">
                      <span>Join Date:</span>
                      <strong>{emp.joinDate}</strong>
                    </div>

                    <div className="emp-card-row">
                      <span>Role:</span>
                      <strong>{emp.role}</strong>
                    </div>

                    <div className="emp-card-row">
                      <span>Salary:</span>
                      <strong>₹ {emp.salary}</strong>
                    </div>

                    <div style={{ marginTop: "12px", textAlign: "right" }}>
                      <button
                        onClick={() => displayRow(emp.id)}
                        className="action-btn btn-mail"
                      >
                        ✉️ Mail
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PayRoll;
