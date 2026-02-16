import React, { useState, useEffect } from "react";
import "../../styles/HR/FeedbackEmployees.css";
import { useNavigate } from "react-router-dom";
function FeedbackEmployees() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const MySession = JSON.parse(localStorage.getItem("MySession"));
  

  const [reviewers, setReviewers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rate, setRate] = useState(0);

  //Auto fill if logged in by admin
  const [givenBy, setGivenBy] = useState(
  MySession ? MySession.employeeId : ""
  );

  useEffect(() => {
  fetch(`${API_BASE_URL}/fetchReviewers`)
    .then(res => res.json())
    .then(data => setReviewers(data))
    .catch(err => console.error("Reviewer fetch error:", err));
}, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error from FeedbackEmployees.jsx:", error);
      }
    };
    loadUser();
  }, []);

  const openFeedbackModal = (emp) => {
    setSelectedEmp(emp);
    setFeedback("");
    setRate(0); // Reset rating for new entry
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    if (!givenBy) {
    alert("Reviewer not selected");
    return;
    }
    
    const submissionData = {
      empId: selectedEmp.employeeId,
      name: selectedEmp.name,
      rating: rate,
      comment: feedback,
      givenBy: givenBy
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submitFeedback/${submissionData.empId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setSelectedEmp(null);
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Feedback to Employees</h2>
      </div>

      <div className="leave-card" >
        <div className="leave-card-header">
          <h3>All Employees</h3>
          <input
            type="text"
            placeholder="Search by name... 🔍"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <table className="leave-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
              .map((emp, index) => (
                <tr key={emp.employeeId}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="emp-cell">
                      <div className="emp-avatar">{emp.name.charAt(0)}</div>
                      <span>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.department}</td>
                  <td>
                    {/* Changed type to "button" so it doesn't trigger onSubmit yet */}
                    <button
                      className="give-feedback-btn"
                      type="button"
                      onClick={() => openFeedbackModal(emp)}>
                      Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {selectedEmp && (
          <form onSubmit={handleFormSubmit}>
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>HR Feedback</h3>
              <p>For: <strong>{selectedEmp.name}</strong></p>
              <div>
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={`fa fa-star ${i <= rate ? "checked" : ""}`}
                    onClick={() => setRate(i)}
                    style={{ cursor: "pointer", fontSize: 24 }}
                  />
                ))}
              </div>
              <textarea
                rows="5"
                placeholder="Write feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required/>

              <select onChange={(e) => setGivenBy(e.target.value)}>
              <option value="">Select Reviewer</option>
              {reviewers.map(rev => (
              <option key={rev.employeeId} value={rev.employeeId}>
              {rev.name} ({rev.role})
              </option>
              ))}
              </select>
              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setSelectedEmp(null)}>Close</button>
              </div>
            </div>
          </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FeedbackEmployees;