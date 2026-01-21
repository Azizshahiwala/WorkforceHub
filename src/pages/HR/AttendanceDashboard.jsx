import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/HR/AttendanceDashboard.css";
import { Link } from "react-router-dom";

function AttendanceDashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [Myevent, setMyEvents] = useState([]);
  const calendarRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 2. Load all attendance records from your backend
  const fetchAttendance = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetchdashboard");
      const attdata = await response.json();
      const demo = attdata;
      setAttendanceRecords(demo);
      console.log("Request from fetchAttendance Query result:",attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

    const loadEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getCompanyUsers");
        const empdata = await response.json();

        if (Array.isArray(empdata) && empdata.length > 0) {
          setEmployees(empdata);
          console.log("Request from loadEmployees Query result:", empdata);
          setSelectedEmp(empdata[0].employeeId); 
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

  useEffect(() => {
    fetchAttendance();
    loadEmployees();
  }, []);

  //Map and Display attendance events for the selected employee
  useEffect(() => {
    if (!selectedEmp || attendanceRecords.length === 0) {
    return;
    }

    const filteredRecords = attendanceRecords.filter(
      (rec) => rec.empId === selectedEmp
    );

    const mappedEvents = filteredRecords.map((item) => ({
      id: `${item.empId}-${item.date}-${item.status}`,
      title: item.status,
      date: item.date,
      color: 
        item.status === "Present" || item.status === "Logged In" ? "green" : 
        item.status === "Late" ? "orange" : 
        item.status === "Absent" ? "red" : "blue",
    }));

    // Directly set events as we no longer need to merge with holidays
    setMyEvents(mappedEvents);
  }, [selectedEmp, attendanceRecords]);
  
  useEffect(() => {
  if (calendarRef.current && Myevent.length > 0) {
    const api = calendarRef.current.getApi();
    api.gotoDate(Myevent[0].date);
  }
}, [Myevent]);

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h2>Attendance Dashboard</h2>
        <button onClick={fetchAttendance}>Refresh Data</button>

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
          ref={calendarRef}
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