import React, { useState, useEffect } from 'react'
import "../../styles/HR/Payroll.css";
import { sendMailGmail } from "./SendingEmail";
function PayRoll() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const MySession = JSON.parse(localStorage.getItem("MySession"));

  const [Window, setWindow] = useState(false);
  const [salBreakup, setSalBreakup] = useState(null);
  const [Employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const [CurrentGatewayRes, setCurrentGatewayRes] = useState("");
  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  async function SendMail(empId) {
    const currentMonth = getCurrentMonthYear();
    try {
      const response = await fetch(`${API_BASE_URL}/pay-gateway/${empId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MonthYear: currentMonth }),
      });

      if (response.ok) {
        setCurrentGatewayRes(response);
        //This filters out non-same employeeId entries. 
        //Meaning it removes entries whose payslip has been sent (empId = employeeId).
        setEmployee((prev) => prev.filter((emp) => emp.employeeId !== empId));
        alert("Mail sent successfully!");
      }
      else {
        alert("Error: Mail could not be processed.");
      }
    }
    catch (error) {
      console.error("PayRoll.jsx Mail Error:", error);
    }
  }
  async function SalaryBreakupCard(empId) {
    const currentMonth = getCurrentMonthYear();
    try {
      const response = await fetch(`${API_BASE_URL}/pay-Salarybreakup/${empId}/${currentMonth + "%"}`);
      const data = await response.json();
      if (response.ok) {
        setSalBreakup(data[0]);
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
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const empdata = await response.json();
        if (Array.isArray(empdata)) {
          console.log("Employee Data Loaded:", empdata);
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

                  <button
                    onClick={() => sendMailGmail(emp)}
                    className="action-btn btn-card"
                  >
                    📧 Send Payslip
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* MODAL SECTION */}
        {Window && salBreakup && (
          <div className="SalBreakup-overlay">
            <div className="SalBreakup-page">
              <h2>Salary Breakup for {salBreakup.name} - {salBreakup.empId}</h2>
              <div className="breakup-stats">
                <p><strong>Base Salary:</strong> ₹{salBreakup.BaseSalary}</p>
                <p><strong>Days Worked:</strong> {salBreakup.daysWorked}</p>
                <p><strong>Tax Deducted:</strong> ₹{salBreakup.TaxAmount}</p>
                <p><strong>Provident fund:</strong> ₹{salBreakup.ProvidentFund}</p>
                <p><strong>Professional Tax:</strong> ₹{salBreakup.ProfessionalTax}</p>
                <p><strong>Gross Pay:</strong> ₹{salBreakup.GrossSalary}</p>
                <p><strong>Loss Of Pay:</strong> ₹{salBreakup.LossOfPay}</p>
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