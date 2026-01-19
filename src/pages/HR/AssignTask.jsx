import React, { useState, useEffect } from "react";
import "../../styles/HR/AssignTask.css";

function AssignTask() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const projectName = "Project InfiniTech";
  const companyName = "InfiniTech Solutions Pvt. Ltd.";

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const result = await response.json();

        const users = Array.isArray(result) ? result : result.users || [];

        const normalizedUsers = users.map((user) => ({
          uid: user.email || user._id || user.employeeId,
          name: user.name || user.fullName || "Unknown",
          role: user.role || user.designation || "Employee",
        }));

        setEmployees(normalizedUsers);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projectData"));
    if (stored?.employees) {
      setSelectedEmployees(stored.employees);
    }
  }, []);

  const toggleEmployee = (emp) => {
    const updated = selectedEmployees.some(e => e.uid === emp.uid)
      ? selectedEmployees.filter(e => e.uid !== emp.uid)
      : [...selectedEmployees, emp];

    setSelectedEmployees(updated);

    localStorage.setItem(
      "projectData",
      JSON.stringify({
        projectName,
        companyName,
        employees: updated,
      })
    );
  };

  return (
    <>
      <div className={`assign-task-page ${showModal ? "assign-task-blur" : ""}`}>
        <h1>Assign Task</h1>
        <div className="assign-task-card">
          <h3>Project Name: {projectName}</h3>
          <p>Company Name: {companyName}</p>

          <button
            className="assign-task-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Members
          </button>

          <h4>Assigned Employees</h4>
          {selectedEmployees.length === 0 ? (
            <p>No employees assigned yet</p>
          ) : (
            <ul>
              {selectedEmployees.map((emp) => (
                <li key={emp.uid}>
                  {emp.name} - {emp.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <div className="assign-task-modal">
          <div className="assign-task-modal-card">
            <h2>Select Employees</h2>

            {employees.map((emp) => (
              <label key={emp.uid} className="assign-task-checkbox">
                <input
                  type="checkbox"
                  checked={selectedEmployees.some(e => e.uid === emp.uid)}
                  onChange={() => toggleEmployee(emp)}
                />
                {emp.name} ({emp.role})
              </label>
            ))}

            <button
              className="assign-task-btn assign-task-close"
              onClick={() => setShowModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AssignTask;
