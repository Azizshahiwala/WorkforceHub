import React, { useEffect, useState } from 'react'
import './CompanyUser.css';
//This file is also called Users.
export const Employees = [
  // --- 5 PRESENT: Logged in today (Dec 21) & Status is Logged In ---
  {
    id: 1,
    name: "Marshall Nichols",
    employeeId: "LA-0011",
    department: "Developer",
    status: "Logged In",
    lastLogin: "2025-12-21 09:15 AM"
  },
  {
    id: 2,  
    name: "Maryam Amiri",
    employeeId: "LA-0012",
    department: "Sales",
    status: "Logged In",
    lastLogin: "2025-12-21 08:45 AM"
  },
  {
    id: 3,
    name: "Gary Camara",
    employeeId: "LA-0013",
    department: "Marketing",
    status: "Logged In",
    lastLogin: "2025-12-21 10:20 AM"
  },
  {
    id: 4,
    name: "Frank Camly",
    employeeId: "LA-0014",
    department: "Testers",
    status: "Logged In",
    lastLogin: "2025-12-21 09:00 AM"
  },
  {
    id: 5,
    name: "Aarav Mehta",
    employeeId: "LA-0015",
    department: "Intern",
    status: "Logged In",
    lastLogin: "2025-12-21 11:45 AM"
  },

  // --- 4 ABSENT: Logged out today OR logged in on a past date ---
  {
    id: 6,
    name: "Sophia Turner",
    employeeId: "LA-0016",
    department: "Finance",
    status: "Logged Out", // Absent: Active today but already logged out
    lastLogin: "2025-12-21 02:30 PM"
  },
  {
    id: 7,
    name: "Daniel Roberts",
    employeeId: "LA-0017",
    department: "Developer",
    status: "Logged Out", // Absent: Last seen yesterday
    lastLogin: "2025-12-20 05:00 PM"
  },
  {
    id: 8,
    name: "Priya Sharma",
    employeeId: "LA-0018",
    department: "Support",
    status: "Logged In", 
    lastLogin: "2025-12-20 09:00 AM" // Absent: Logged in yesterday but NOT today
  },
  {
    id: 9,
    name: "Michael Chen",
    employeeId: "LA-0019",
    department: "Marketing",
    status: "Logged Out", // Absent: No login today
    lastLogin: "2025-12-19 06:10 PM"
  },

  // --- 1 INVALID: Future date relative to "Today" (Dec 21) ---
  {
    id: 10,
    name: "Olivia Brown",
    employeeId: "LA-0020",
    department: "Sales",
    status: "Logged In",
    lastLogin: "2025-12-25 09:00 AM" // Invalid: Should not appear in current attendance lists
  }
];
//This function exports User info to AttendanceMethod2
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
              <th>Last Login</th>
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
                <td>{req.lastLogin}</td>
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
