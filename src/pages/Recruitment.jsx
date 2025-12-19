import React, { useState } from "react";
import "./Recruitment.css";
const initialApplications = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Developer",
    email: "sarah.j@email.com",
    phone: "+1 2345678900",
    experience: "5 years",
    appliedDate: new Date().toLocaleDateString(),
    ReportView : <button className="Repbtn" >Show report</button>,
    Acceptbtn : <button className="Accbtn">Send Mail</button>,
    Rejectbtn : <button className="Rejbtn">Reject</button>
  },
  {
    id: 2,
    name: "John Doe",
    position: "Junior Developer",
    email: "john.d@email.com",
    phone: "+1 2345678901",
    experience: "2 years",
    appliedDate: new Date().toLocaleDateString(),
    ReportView : <button className="Repbtn" >Show report</button>,
    Acceptbtn : <button className="Accbtn">Send Mail</button>,
    Rejectbtn : <button className="Rejbtn">Reject</button>
  }
  
];

function Recruitment() {
  const [applications, setApplications] = useState(initialApplications);

  return (<>
  <div>
    <table border={0} cellPadding={10} cellSpacing={0}>
    <tr className="Inner-table">
      <th>Name</th>
      <th>Position for</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Experience</th>
      <th>Applied Date</th>
      <th>Report View</th>
      <th>Accept / Reject</th>
    </tr>
    {applications.map((Submission, key) => (
      <tr className="Inner-table" key={key}>
        <td>{Submission.name}</td>
        <td>{Submission.position}</td>
        <td>{Submission.email}</td>
        <td>{Submission.phone}</td>
        <td>{Submission.experience}</td>
        <td>{Submission.appliedDate}</td>
        <td>{Submission.ReportView}</td>
        <td>{Submission.Acceptbtn} {Submission.Rejectbtn}</td>
      </tr>
    ))}
    </table>
  </div>
  </>);
}

export default Recruitment;