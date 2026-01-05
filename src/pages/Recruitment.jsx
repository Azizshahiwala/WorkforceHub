import React, { useState,useEffect } from "react";
import "./Recruitment.css";

function Recruitment() {

const [applications, setApplications] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/RegisterForm/applications")
    .then(res => res.json())
    .then(data => setApplications(data));
  }, []);

  function Reject(id) {
  fetch(`http://localhost:5000/api/recruitment/reject/${id}`, {
    method: "DELETE"
  }).then(() => {
    setApplications(prev => prev.filter(item => item.id !== id));
  }).then(()=>{alert(this.message)});
}
  function Accept(id) {
  fetch(`http://localhost:5000/api/RegisterConfirm/${id}`, {
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
        alert(data.error || "Admission failed");
      }
    })
    .catch(err => {
      console.error("Admit error:", err);
      alert("Server error while admitting candidate");
    });
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
        <td><button className="Repbtn">Show report</button></td>
        <td><button className="Accbtn"onClick={() =>Accept(Submission.id)}>Notify for interview</button>
         <button className="Rejbtn" onClick={() =>Reject(Submission.id)}>Reject</button></td>
      </tr>
    ))}
    </table>
  </div>
  </>);
}

export default Recruitment;