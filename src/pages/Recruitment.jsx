import React, { useState } from "react";
const initialApplications = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Developer",
    email: "sarah.j@email.com",
    phone: "+1 234-567-8900",
    experience: "5 years",
    status: "Interview Scheduled",
    appliedDate: "15 Dec, 2025",
    interviewDate: "22 Dec, 2025",
    ReportView : <button>[Show report]</button>,
    Acceptbtn : <button>Send Mail</button>,
    Rejectbtn : <button>Reject</button>
  },
  
];

function Recruitment() {
  const [applications, setApplications] = useState(initialApplications);

  return (<>
  <div>
    <table className="Inner-table" border={1} cellPadding={20} cellSpacing={0}>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Experience</th>
      <th>Status</th>
      <th>Applied Date</th>
      <th>Interview Date</th>
      <th>Report View</th>
      <th>Accept / Reject</th>
    </tr>
    {applications.map((Submission, key) => (
      <tr key={key}>
        <td>{Submission.name}</td>
        <td>{Submission.position}</td>
        <td>{Submission.email}</td>
        <td>{Submission.phone}</td>
        <td>{Submission.experience}</td>
        <td>{Submission.status}</td>
        <td>{Submission.appliedDate}</td>
        <td>{Submission.interviewDate}</td>
        <td>{Submission.ReportView}</td>
        <td>{Submission.Acceptbtn} {Submission.Rejectbtn}</td>
      </tr>
    ))}
    </table>
  </div>
  </>);
}

export default Recruitment;