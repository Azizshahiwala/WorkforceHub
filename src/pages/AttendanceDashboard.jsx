import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AttendanceDashboard.css";
import { Link } from "react-router-dom";

function AttendanceDashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [Myevent, setMyEvents] = useState([]);

  // 1. Load Employees and set default selection
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getCompanyUsers");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setEmployees(data); 
          setSelectedEmp(data[0].employeeId); 
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    loadEmployees();
  }, []);

  // 2. Load all attendance records from your backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/att-dashboard");
        const data = await response.json();
        setAttendanceRecords(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);

  // 3. Map and Display attendance events for the selected employee
  useEffect(() => {
    if (!selectedEmp || attendanceRecords.length === 0) {
      setMyEvents([]); // Clear events if no employee or data
      return;
    }

    const filteredRecords = attendanceRecords.filter(
      (rec) => rec.empId === selectedEmp
    );

    const mappedEvents = filteredRecords.map((item) => ({
      id: `att-${item.date}`,
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