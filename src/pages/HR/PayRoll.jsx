import React, { useState, useEffect } from 'react'
import "../../styles/HR/Payroll.css";
import MessageBox from "../../Misc/MessageBox";
function PayRoll() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [devMode, setDevMode] = useState(false);
  const [loading, isloading] = useState(false);
  const [processingId, setprocessingId] = useState(null);
  const [message,setMessage] = useState(null);

  const [Window, setWindow] = useState(false);
  const [salBreakup, setSalBreakup] = useState(null);
  const [Employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  
  const isMonthCompleted = (monthYearStr) => {
    const [year, month] = monthYearStr.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

    if (currentYear > year) return true;
    if (currentYear === year && currentMonth > month) return true;

    return false;
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  async function MailProcess(emailTo, empName, empID) {
    //Step 1: onclick- fetch from Payroll.py to get details.
    const currentMonth = getCurrentMonthYear();
    isloading(true);
    setprocessingId(empID);
    try {
      const response = await fetch(`${API_BASE_URL}/pay-gateway/${empID}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MonthYear: currentMonth, emailTo: emailTo, empName: empName }),
      });
      const data = await response.json();
      if (response.ok) {
        //This filters out non-same employeeId entries. 
        //Meaning it removes entries whose payslip has been sent (empId = employeeId).
        setEmployee((prev) => prev.filter((emp) => emp.employeeId !== empID));
        setMessage({type:"Success",text:"Email has been sent to "+data.name});
      }
      else {
        setMessage({type:"Info",text:"Mail could not be processed"});
        setMessage({type:"Error",text:"Failed:"+data.error || data.message || "Unknown server error"});
      }
      isloading(false);
      setprocessingId(null);
    }
    catch (error) {
      setMessage({type:"Error",text:"PayRoll.jsx Mail Error:", error});
      isloading(false);
    }
  }
  async function SalaryBreakupCard(empId) {
    const currentMonth = getCurrentMonthYear();
    try {
      const response = await fetch(`${API_BASE_URL}/pay-Salarybreakup/${empId}/${currentMonth}`);
      const data = await response.json();
      if (response.ok) {
        setSalBreakup(data[0]);
        setWindow(true); // Open window ONLY after data is received
      } else {
        setMessage({type:"Error",text:"Error fetching breakup data"});
      }
    } catch (error) {
      setMessage({type:"Error",text:error});
    }
  }

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const empdata = await response.json();
        if (Array.isArray(empdata)) {
          setEmployee(empdata);
        }
      } catch (error) {
        setMessage({type:"Error",text:"Load Error:", error});
      }
    };
    loadEmployees();
  }, []);

  const currentMonth = getCurrentMonthYear();
  const completed = isMonthCompleted(currentMonth);

  return (
    <div className="leave-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />
      <div className="leave-header">
        <h2>Employee Salary</h2>
      </div>

      <div className="leave-card">
        <div className="leave-card-header">
          <div className="dev-toggle">
            <label>
              <input
                type="checkbox"
                checked={devMode}
                onChange={() => setDevMode(!devMode)}
              />
              Dev Mode (Ignore Date Check)
            </label>
          </div>
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
                  <span>Salary:</span> <strong>₹ {emp.BaseSalary}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Phone:</span> <strong> {emp.phoneNumber}</strong>
                </div>
                <div className="emp-card-row">
                  <span>Role:</span> <strong>{emp.role}</strong>
                </div>

                <div style={{ marginTop: "12px", textAlign: "right" }}>
                  {/* Check both the completion logic AND your new devMode flag */}
                  {(completed || devMode) ? (
                    <>
                      <button
                        onClick={() => SalaryBreakupCard(emp.employeeId)}
                        className="action-btn btn-card">
                        📄 Salary Breakup
                      </button>

                      {loading && emp.employeeId == processingId ?
                        (
                          <div className="loader-container">
                            <div className="loader"/>
                          </div>) : (
                          <button
                            onClick={() => MailProcess(emp.email, emp.name, emp.employeeId)}
                            className="action-btn btn-card">
                            📧 Send Payslip
                          </button>)}
                    </>) : (<span className="pending-tag">⏳ Month In-Progress</span>)}
                </div>
              </div>
            ))}
        </div>

        {Window && salBreakup && (
          <div className="SalBreakup-overlay">
            <div className="SalBreakup-page">
              <h2>Salary Breakup for {salBreakup.name} - {salBreakup.empId}</h2>
              <div className="breakup-stats">
                <p><strong>Base Salary:</strong> ₹{salBreakup.BaseSalary.toFixed(2)}</p>
                <p><strong>Days Worked:</strong> {salBreakup.daysWorked}</p>
                <p><strong>Tax Deducted:</strong> ₹{salBreakup.TaxAmount}</p>
                <p><strong>Provident fund:</strong> ₹{salBreakup.ProvidentFund}</p>
                <p><strong>Professional Tax:</strong> ₹{salBreakup.ProfessionalTax}</p>
                <p><strong>Gross Pay:</strong> ₹{salBreakup.GrossSalary.toFixed(2)}</p>
                <p><strong>Loss Of Pay:</strong> ₹{salBreakup.LossOfPay.toFixed(2)}</p>
                <hr />
                <p className="net-pay"><strong>Net Take-Home:</strong> ₹{salBreakup.NetSalary.toFixed(2)}</p>
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