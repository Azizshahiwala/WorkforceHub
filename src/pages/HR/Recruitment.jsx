import React, { useState,useEffect } from "react";

import "../../styles/HR/Recruitment.css";
function Recruitment() {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const [applications, setApplications] = useState([]);

const MySession = JSON.parse(localStorage.getItem("MySession"));

  useEffect(() => {
  fetch(`${API_BASE_URL}/RegisterForm/applications`)
    .then(res => res.json())
    .then(data => setApplications(data));
  }, []);

  function Reject(id) {
  fetch(`${API_BASE_URL}/recruitment/reject/${id}`, {
    method: "DELETE"
  }).then(() => {
    setApplications(prev => prev.filter(item => item.id !== id));
  }).then(()=>{alert(this.message)});
}
  function Accept(id) {
  fetch(`${API_BASE_URL}/RegisterConfirm/${id}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Candidate admitted successfully");

        // Remove admitted candidate from table
        setApplications(prev =>
          prev.filter(app => app.id !== id)
        );
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error("Admit error:", err);
      alert("Server error while admitting candidate");
    });
}
function showReport(id) {
    // Open the backend PDF route in a new tab
    window.open(`${API_BASE_URL}/recruitment/resume/${id}`, '_blank');
} 
  return (<>
  <div>
    <table className="Inner-table"border={1} cellPadding={10} cellSpacing={0}>
    <tr>
      <th>Name</th>
      <th>Position for</th>
      <th>
      <tr>
        <th>Email and Phone</th>
      </tr>
      </th>
      <th>Experience</th>
      <th>Applied Date</th>
      <th>Report View</th>
      <th>Accept / Reject</th>
    </tr>
    {applications.map((Submission, key) => (
      <tr key={key}>
        <td>{Submission.name}</td>
        <td>{Submission.position}</td>
        <td>
          <tr>
          <tr className="Table_row_email">{Submission.email}</tr>
          <tr className="Table_row_phone">{Submission.phone}</tr>
          </tr>
        </td> 
        <td>{Submission.experience}</td>   
        <td>{Submission.appliedDate}</td>
        <td><button className="Repbtn" onClick={() => showReport(Submission.id)}>Show report</button></td>
        <td><button className="Accbtn"onClick={() =>Accept(Submission.id)}>Notify for interview</button>
         <button className="Rejbtn" onClick={() =>Reject(Submission.id)}>Reject</button></td>
      </tr>
    ))}
    </table>
  </div>
  </>);
}

export default Recruitment;