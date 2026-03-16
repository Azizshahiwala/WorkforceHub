// import React, { useEffect, useState } from "react";
// import "../../styles/Employees/AssignedTaskByHR.css";
// import MessageBox from "../../Misc/MessageBox";
// function AssignedTaskByHR() {
//   const [projectData, setProjectData] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("projectData"));
//     if (stored) setProjectData(stored);
//   }, []);

//   if (!projectData) {
//     return <h3 className="employee-no-task">No task assigned yet</h3>;
//   }

//   return (
    
//     <body className="employee-view-page">
//       <h1 className="employee-view-title">Assigned Task</h1>

//       <div className="employee-assigned-card">
//         <h2>Assigned Project</h2>

//         <p>
//           <strong>Project Name:</strong> {projectData.projectName}
//         </p>
//         <p>
//           <strong>Company Name:</strong> {projectData.companyName}
//         </p>

//         <h3>Assigned Team Members</h3>
//         <ul>
//           {projectData.employees.map((emp) => (
//             <li key={emp.uid || emp.id}>
//               {emp.name} - {emp.role}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </body>
//   );
// }

// export default AssignedTaskByHR;
