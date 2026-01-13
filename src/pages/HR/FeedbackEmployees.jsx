import React, { useState, useEffect } from "react";
import "../HR/FeedbackEmployees.css";

function FeedbackEmployees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rate, setRate] = useState(0);

  // Load employees from backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getCompanyUsers"
        );
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    loadUser();
  }, []);

  // Open feedback modal
  const giveFeedback = (emp) => {
    setSelectedEmp(emp);
    setFeedback("");
    setRate(0);
  };

  // Submit feedback
  const submitFeedback = () => {
    if (rate === 0 || feedback.trim() === "") {
      alert("Please give rating and feedback");
      return;
    }

    const data = {
      empId: selectedEmp._id || selectedEmp.id,
      name: selectedEmp.name,
      rating: rate,
      comment: feedback,
      date: new Date().toISOString(),
    };

    const old = JSON.parse(localStorage.getItem("feedback")) || [];
    const updated = [...old, data];
    localStorage.setItem("feedback", JSON.stringify(updated));

    setSelectedEmp(null);
  };

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Feedback to Employees</h2>
      </div>

      <div className="leave-card">
        <div className="leave-card-header">
          <h3>All Employees</h3>
          <input
            type="text"
            placeholder="Search by name... 🔍"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              .filter((emp) =>
                emp.name?.toLowerCase().includes(search.toLowerCase())
              )
              .map((emp, index) => (
                <tr key={emp._id || emp.id|| `${emp.employeeId}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="emp-cell">
                      <div className="emp-avatar">
                        {emp.name?.charAt(0)}
                      </div>
                      <span>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button
                      className="give-feedback-btn"
                      onClick={() => giveFeedback(emp)}
                    >
                      Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Feedback Modal */}
        {selectedEmp && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>HR Feedback</h3>
              <p>
                For: <strong>{selectedEmp.name}</strong>
              </p>

              {/* Star Rating */}
              <div style={{ marginBottom: "10px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={`star-${i}`}
                    className={`fa fa-star ${i <= rate ? "checked" : ""}`}
                    onClick={() => setRate(i)}
                    style={{ cursor: "pointer", fontSize: "24px", marginRight: "5px" }}
                  />
                ))}
              </div>

              <textarea
                rows="5"
                placeholder="Write feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <div className="modal-actions">
                <button onClick={submitFeedback}>Submit</button>
                <button onClick={() => setSelectedEmp(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackEmployees;
