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

  //fetch all attendance backend
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchdashboard`);
      const attdata = await response.json();
      const demo = attdata;
      setAttendanceRecords(demo);
     } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  //fetch all employees from backend
    const loadEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getCompanyUsers`);
        const empdata = await response.json();

        if (Array.isArray(empdata) && empdata.length > 0) {
          setEmployees(empdata);
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
    // 1. Check for Leave first
    (item.leaveDuration && item.leaveDuration?.toLowerCase() !== "null") || item.status?.toLowerCase() === "leave" 
      ? "blue" 
      // 2. Check for Present or Logged In
      : item.status?.toLowerCase() === "present" || item.status === "Logged In" 
        ? "green" 
        // 3. Check for Absent
        : item.status?.toLowerCase() === "absent" 
          ? "red" 
          // 4. Default color
          : "gray",
}));
    //Logic: IF status is not null, change colour to blue (leave)
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