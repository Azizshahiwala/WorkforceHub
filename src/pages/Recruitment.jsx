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
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "UI/UX Designer",
    email: "m.chen@email.com",
    phone: "+1 2345678902",
    experience: "4 years",
    appliedDate: new Date().toLocaleDateString(),
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "QA Engineer",
    email: "emily.r@email.com",
    phone: "+1 2345678903",
    experience: "3 years",
    appliedDate: new Date().toLocaleDateString(),
  },
  {
    id: 5,
    name: "David Smith",
    position: "Product Manager",
    email: "d.smith@email.com",
    phone: "+1 2345678904",
    experience: "7 years",
    appliedDate: new Date().toLocaleDateString(),
  },
  {
    id: 6,
    name: "Aria Gupta",
    position: "Backend Developer",
    email: "aria.g@email.com",
    phone: "+1 2345678905",
    experience: "2 years",
    appliedDate: new Date().toLocaleDateString(),
  },
  {
    id: 7,
    name: "James Wilson",
    position: "DevOps Engineer",
    email: "j.wilson@email.com",
    phone: "+1 2345678906",
    experience: "6 years",
    appliedDate: new Date().toLocaleDateString(),
  },
  {
    id: 8,
    name: "Sophia Martinez",
    position: "HR Specialist",
    email: "s.martinez@email.com",
    phone: "+1 2345678907",
    experience: "5 years",
    appliedDate: new Date().toLocaleDateString(),
  }
];
const [applications, setApplications] = useState(initialApplications);

  function Reject(id){
    
    //initialApplications -> array of objects. So i need to create a copy of it to modify.

    const UpdatedList = applications.filter(item => item.id != id);  
    //item => item.id is the same as array function. item.id refers to list's item
    // and just 'id' refers to the id passed in the function parameter.
    
    setApplications(UpdatedList);
    //This re-renders the component with updated list.
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
        <td><button className="Repbtn" >Show report</button></td>
        <td><button className="Accbtn">Send Mail</button>
         <button className="Rejbtn" onClick={() =>Reject(Submission.id)}>Reject</button></td>
      </tr>
    ))}
    </table>
  </div>
  </>);
}

export default Recruitment;