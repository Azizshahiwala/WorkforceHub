import React, { useState,useEffect } from "react";

import "../../styles/HR/Recruitment.css";
function Recruitment() {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const [applications, setApplications] = useState([]);
const [analyzingId, setAnalyzingId] = useState(null);
const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
const [activeDesc, setActiveDesc] = useState(null);
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
  function SendLink(id) {
  fetch(`${API_BASE_URL}/RegisterConfirm/${id}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Interview link sent successfully");
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
const FindAnalysis = (id) => {
  //This function finds score and description.
  setAnalyzingId(id);
  //Send post req to backend to calculate score
  fetch(`${API_BASE_URL}/recruitment/getanalysis/${id}`, {
    method: "POST"
  })
    .then(async (res) => {
      if (res.status === 429) {
        throw new Error("Please wait...");
      }
      return res.json();
    })
    .then(data => {
      if (data.status === "success") {

        // Refresh the applications list to show updated AI_SCORE
        fetch(`${API_BASE_URL}/RegisterForm/applications`)
          .then(res => res.json())
          .then(data => setApplications(data));
      }
    }).catch(err => {
      console.error("Analysis error:", err);
      
    }).finally(() => {setAnalyzingId(null);});
};
const ShowDesc = (description) => {
  setActiveDesc(description);
  setIsDescriptionVisible(true);
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
      {/* <th>Score by AI (out of 10)</th>
      <th>Description by AI</th> */}
      <th>Send for interview</th>
    </tr>
    {applications.map((Submission, key) => (
  <tr key={Submission.id || key}>
    <td>{Submission.name}</td>
    <td>{Submission.position}</td>
    <td className="contact-info">
      <span>{Submission.email}</span>
      <span>{Submission.phone}</span>
    </td> 
    <td>{Submission.experience}</td>   
    <td>{Submission.appliedDate}</td>
    <td><button className="Repbtn" onClick={() => showReport(Submission.id)}>Resume</button></td>
    
    {/* <td>
      {Submission.AI_SCORE === "Not calculated" ? (
        analyzingId === Submission.id ? <p className="loading-text">⌛ Analyzing...</p> :
        <button className="Scorebtn" onClick={() => FindAnalysis(Submission.id)}>Run AI</button>
      ) : <span className="ai-score-badge">{Submission.AI_SCORE}</span>}
    </td> */}
    
    {/* <td className="desc-cell">
      {Submission.AI_DESCRIPTION?.toLowerCase() === "not generated" ? "---" : (
          <button className="ai-view-btn" onClick={() => ShowDesc(Submission.AI_DESCRIPTION)}>
            Click here to get description
          </button>
      )}
    </td> */}
    
    <td className="action-btns">
      <button className="Accbtn" onClick={() => SendLink(Submission.id)}>Send link</button>
      <button className="Rejbtn" onClick={() => Reject(Submission.id)}>Reject</button>
    </td>
  </tr>
))}
    </table>
  </div>
  {isDescriptionVisible && (
  <div className="modal-overlay">
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>✨ AI Candidate Insights</h3>
        <button className="close-btn" onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}>✖</button>
      </div>
      <div className="modal-body">
        <p>{activeDesc}</p>
      </div>
    </div>
  </div>
)}
  </>);
}

export default Recruitment;