import React, { useEffect, useState } from 'react'
import './CompanyUser.css';
//This file is also called Users.
const Employees = [
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0012",
    department: "Developer"
  },
  {
    id: 2,  
    name: "Maryam Amiri",
    employeeId: "LA-0011",
    department: "Sales"
  },
  {
    id: 3,
    name: "Gary Camara",
    employeeId: "LA-0013",
    department: "Marketing"
  },
  {
    id: 4,
    name: "Frank Camly",
    employeeId: "LA-0014",
    department: "Testers"
  },
  {
    id: 5,
    name: "Aarav Mehta",
    employeeId: "LA-0015",
    department: "Intern"
  },
  {
    id: 6,
    name: "Sophia Turner",
    employeeId: "LA-0016",
    department: "Finance"
  },
  {
    id: 7,
    name: "Daniel Roberts",
    employeeId: "LA-0017",
    department: "Developer"
  },
  {
    id: 8,
    name: "Priya Sharma",
    employeeId: "LA-0018",
    department: "Support"
  },
  {
    id: 9,
    name: "Michael Chen",
    employeeId: "LA-0019",
    department: "Marketing"
  },
  {
    id: 10,
    name: "Olivia Brown",
    employeeId: "LA-0020",
    department: "Sales"
  }
];
function CompanyUser() {
  const [Employee, setEmployee] = useState(Employees);
  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Users</h2>
      </div>

      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
        </div>

        <table className="leave-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
            </tr>
          </thead>

          <tbody>
            {Employee.map((req, index) => (
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
                <td>{req.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function FetchEmployeeData(){
  return Employees.length;
}
export function GetStaffData(){
  var RawNonStaffs = ["Intern","Support"];
  var StaffList = Employees.filter((emp)=>{

    // 1. Create a boolean variable to check if they are "Non-Staff"
  //This returns true if emp is Non-Staff
  var NonStaffs = RawNonStaffs.includes(emp.department);

  // 2. Return the opposite (the actual Staff)
  // true means its Staff
  var Staffs = !NonStaffs;

  // 3. If value is True, put it in StaffList
  return Staffs;
  })
  return StaffList.length;
}
export default CompanyUser;
