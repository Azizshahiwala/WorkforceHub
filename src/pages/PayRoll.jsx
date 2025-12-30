import React, { useState, useEffect } from 'react'
import './PayRoll.css';

function PayRoll() {
  const [Window, setWindow] = useState(false);
  const [salBreakup, setSalBreakup] = useState(null);
  const [Employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");

  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  async function SalaryBreakupCard(empId) {
    const currentMonth = getCurrentMonthYear();
    try {
      const response = await fetch(`http://localhost:5000/api/pay-Salarybreakup/${empId}/${currentMonth+"%"}`);
      const data = await response.json();
      
      console.log("HTTP STATUS:", response.status);
    console.log("RAW RESPONSE:", data);
      if (response.ok) {
        setSalBreakup(data[0]);
        console.log("Salary Breakup Data:", salBreakup);
        setWindow(true); // Open window ONLY after data is received
      } else {
        alert("Error fetching breakup data");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getCompanyUsers");
        const empdata = await response.json();
        if (Array.isArray(empdata)) {
          setEmployee(empdata);
        }
      } catch (error) {
        console.error("Load Error:", error);
      }
    };
    loadEmployees();
  }, []);

  return (
    <div className="leave-page">
      <div className="leave-header">
        <h2>Employee Salary</h2>
      </div>

      <div className="leave-card">
        <div className="leave-card-header">
          <input
            type="text"
            placeholder="Search by name...🔍"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="emp-grid">
          {Employee
            .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
            .map((emp) => (
              <div className="emp-card" key={emp.employeeId}>
                <div className="emp-card-row">
                  <span>ID:</span> <strong>{emp.employeeId}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Name:</span> <strong>{emp.name}</strong>
                </div>
                <div className="emp-card-row">
                  {/* FIXED: Using 'base_salary' or 'BaseSalary' to match your DB */}
                  <span>Salary:</span> <strong>₹ {emp.BaseSalary}</strong>
                </div>
                <div className="emp-card-row">
                  {/* FIXED: Using 'base_salary' or 'BaseSalary' to match your DB */}
                  <span>Phone:</span> <strong> {emp.phoneNumber}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Role:</span> <strong>{emp.role}</strong>
                </div>

                <div style={{ marginTop: "12px", textAlign: "right" }}>
                  <button
                    onClick={() => SalaryBreakupCard(emp.employeeId)}
                    className="action-btn btn-card"
                  >
                    📄 Salary Breakup
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* MODAL SECTION */}
        {Window && salBreakup && (
          <div className="SalBreakup-overlay">
            <div className="SalBreakup-page">
              <h2>Salary Breakup for {salBreakup.empId}</h2>
              <div className="breakup-stats">
                <p><strong>Base Salary:</strong> ₹{salBreakup.BaseSalary}</p>
                <p><strong>Days Worked:</strong> {salBreakup.daysLoggedIn}</p>
                <p><strong>Tax Deducted:</strong> ₹{salBreakup.TaxAmount}</p>
                <p><strong>Gross Pay:</strong> ₹{salBreakup.GrossSalary}</p>
                <hr />
                <p className="net-pay"><strong>Net Take-Home:</strong> ₹{salBreakup.NetSalary}</p>
              </div>
              <button className="close-btn" onClick={() => setWindow(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayRoll;