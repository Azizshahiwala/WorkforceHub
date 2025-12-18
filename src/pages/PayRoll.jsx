import React, { useState } from 'react'
import './PayRoll.css';

const data = [
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0012",
    phone: "+91 9876543210",
    joinDate: "2022-03-15",
    role: "Senior Developer",
    salary: 85000
  },
  {
    id: 2,
    name: "Maryam Amiri",
    employeeId: "LA-0011",
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


  // Remove and Display the name   
  const removeRow = (id) => {
    setEmployee(Employee.filter(item => item.id !== id));
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
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Phone</th>
              <th>Join - Date</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {/* filter => Loop through all employees and show only those whose name contains the 
            searched text, ignoring case. */}

            {Employee.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
              .map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>

                <td>
                  <div className="emp-cell">
                    <div className="emp-avatar">
                      {req.name.charAt(0)}
                    </div>
                    <span>{req.name}</span>
                  </div>
                </td>

                <td>{req.employeeId}</td>
                <td>{req.phone}</td>
                <td>{req.joinDate}</td>
                <td>{req.role}</td>
                <td>{req.salary}</td>
                <td>
                    <div className="action-group">
                        <button onClick={()=> removeRow(req.id)}
                        className="action-btn btn-mail">
                        ✉️ Mail</button>

                        <button onClick={()=> removeRow(req.id)}
                        className="action-btn btn-delete">
                        🗑️ Delete</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PayRoll;
