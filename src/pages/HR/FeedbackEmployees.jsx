import React, { useState, useEffect } from "react";
import "../../styles/HR/FeedbackEmployees.css";
import MessageBox from "../../Misc/MessageBox";
function FeedbackEmployees() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [message, setMessage] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setMessage({ type: "Error", text:"Dashboard error: ",err});
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
    
    const submissionData = {
      empId: selectedEmp.employeeId,
      name: selectedEmp.name,
      rating: rate,
      comment: feedback,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submitFeedback/${submissionData.empId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "Success", text:data.message});
        setSelectedEmp(null);
      } else {
        setMessage({ type: "Error", text:data.message});
      }
    } catch (error) {
      setMessage({ type: "Error", text:"Could not publish feedback. Make sure server is running: "+error});
    }
  };

  return (
    <div className="leave-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
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