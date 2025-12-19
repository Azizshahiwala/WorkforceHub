import React, { useState } from "react";
import "./Recruitment.css";


function Recruitment() {
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
    Rejectbtn : <button className="Rejbtn" onClick={() =>Reject()}>Reject</button>
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
    Rejectbtn : <button className="Rejbtn" onClick={(id) =>Reject(id)}>Reject</button>
  }
];
  function Reject(id){
    
    //initialApplications -> array of objects. So i need to create a copy of it to modify.

    const UpdatedList = applications.filter(item => item.id != id);  
    //item => item.id is the same as array function. item.id refers to list's item
    // and just 'id' refers to the id passed in the function parameter.
    
    setApplications(UpdatedList);
    //This re-renders the component with updated list.
   }
  const [applications, setApplications] = useState(initialApplications);

  return (<>
  <div>
    <table border={1} cellPadding={10} cellSpacing={0}>
    <tr className="Inner-table">
      <th>Name</th>
      <th>Position for</th>
      <th>
      <tr className="Nested_table_row">
        <th>Email and Phone</th>
      </tr>
      </th>
      <th>Experience</th>
      <th>Applied Date</th>
      <th>Report View</th>
      <th>Accept / Reject</th>
    </tr>
    {applications.map((Submission, key) => (
      <tr className="Inner-table" key={key}>
        <td>{Submission.name}</td>
        <td>{Submission.position}</td>
        <td>
          <tr className="Nested_table_row">
          <tr>{Submission.email}</tr>
          <tr>{Submission.phone}</tr>
          </tr>
        </td> 
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