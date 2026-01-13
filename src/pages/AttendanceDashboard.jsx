import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AttendanceDashboard.css";
import { Link } from "react-router-dom";

function AttendanceDashboard() {
  const [employees, setEmployees] = useState([]);
  const [attRecord, setAttendanceRecords] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [Myevent, setMyEvents] = useState([]);
  const [loading, setloading] = useState(true);
  // 2. Fetch all attendance records from your backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        
        const response = await fetch("http://localhost:5000/api/fetchdashboard");
        const attdata = await response.json();
        const demo = attdata;
        setAttendanceRecords(demo);
        setloading(false);
        console.log("Step 1 fetchAttendance done")
      } catch (error) {
        setloading(false);
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);

  // 1. Load Employees and set default selection
  useEffect(() => {
    const loadEmployees = async () => {
      try {

        if(attRecord.length === 0) return;
        
        const response = await fetch("http://localhost:5000/api/getCompanyUsers");
        const empdata = await response.json();

        if (Array.isArray(empdata) && empdata.length > 0) {
          setEmployees(empdata);
          console.log("Request from loadEmployees Query result:", empdata);
          setSelectedEmp(empdata[0].employeeId); 
          console.log("Step 2 loademployees done.")
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
      finally{
        setloading(false);
      }
    };
    loadEmployees();
  }, [attRecord]);

  useEffect(() => {
  console.log("Attendance state updated:", attRecord);
  }, [attRecord]);

  //Map and Display attendance events for the selected employee
  useEffect(() => {
  if (!selectedEmp || attRecord.length === 0) return;

  const mappedEvents = attRecord
    .filter((rec) => rec.empId === selectedEmp)
    .map((item) => ({
      id: `att-${item.empId}-${item.date}`,
      title: item.status,
      date: item.date, // YYYY-MM-DD (perfect)
      color:
        item.status === "Present" || item.status === "Logged In"
          ? "green"
          : item.status === "Late"
          ? "orange"
          : item.status === "Absent"? "red": "blue",
          
    }));

  setMyEvents(mappedEvents);
  console.log("Step 3 mapping and displaying done.")
}, [selectedEmp, attRecord]);

  // if(loading) 
  //   { 
  //    return <p>Please wait while we fetch attendance records...</p>; 
  //   }
  return (
    
    <div className="attendance-page">
      <div className="attendance-header">
        <h2>Attendance Dashboard</h2>

        <select
          className="emp-select"
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="attendance-legend">
        <div><span className="dot present"></span> Present</div>
        <div><span className="dot absent"></span> Absent</div>
        <div><span className="dot leave"></span> Other/Leave</div>
      </div>
      
      <div>
        <Link to="./AttendanceOverview" className="OverviewBtn">Click here to get overview</Link>
      </div>

      <div className="calendar-card">
        <FullCalendar
          key={selectedEmp + Myevent.length}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={Myevent}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      </div>
    </div>
  );
}

export default AttendanceDashboard;