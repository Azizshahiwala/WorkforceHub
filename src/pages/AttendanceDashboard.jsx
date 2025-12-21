import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AttendanceDashboard.css";

// 👉 Dummy employee list
const employees = [
  { id: "LA-11", name: "Marshall Nichols" },
  { id: "LA-12", name: "Maryam Amiri" },
  { id: "LA-13", name: "Gary Camara" },
  { id: "LA-14", name: "Frank Camly" },
  { id: "LA-15", name: "Aarav Mehta" },
  { id: "LA-16", name: "Sophia Turner" },
  { id: "LA-17", name: "Daniel Roberts" },
  { id: "LA-18", name: "Priya Sharma" },
  { id: "LA-19", name: "Michael Chen" },
  { id: "LA-20", name: "Olivia Brown" },
];

// 👉 Attendance per employee
const attendanceData = {
  "LA-11": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Leave" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Absent" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Leave" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Absent" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Leave" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Absent" },
  ],

  "LA-12": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Absent" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Present" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Leave" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Absent" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Leave" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Absent" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Present" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Absent" },
    { date: "2025-12-20", status: "Present" },
  ],

  "LA-13": [
    { date: "2025-12-01", status: "Leave" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Absent" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Present" },
    { date: "2025-12-07", status: "Leave" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Absent" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Leave" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Absent" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Present" },
  ],
  "LA-14": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Leave" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Absent" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Leave" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Absent" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Leave" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Absent" },
  ],

  "LA-15": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Absent" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Present" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Leave" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Absent" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Leave" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Absent" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Present" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Absent" },
    { date: "2025-12-20", status: "Present" },
  ],

  "LA-16": [
    { date: "2025-12-01", status: "Leave" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Absent" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Present" },
    { date: "2025-12-07", status: "Leave" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Absent" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Leave" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Absent" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Present" },
  ],
  "LA-17": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Leave" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Absent" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Leave" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Absent" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Leave" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Absent" },
  ],

  "LA-18": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Absent" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Present" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Leave" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Absent" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Leave" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Absent" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Present" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Absent" },
    { date: "2025-12-20", status: "Present" },
  ],

  "LA-19": [
    { date: "2025-12-01", status: "Leave" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Absent" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Present" },
    { date: "2025-12-07", status: "Leave" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Absent" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Leave" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Absent" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Present" },
  ],
  "LA-14": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Present" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Leave" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Absent" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Present" },
    { date: "2025-12-10", status: "Leave" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Present" },
    { date: "2025-12-13", status: "Absent" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Present" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Leave" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Present" },
    { date: "2025-12-20", status: "Absent" },
  ],

  "LA-20": [
    { date: "2025-12-01", status: "Present" },
    { date: "2025-12-02", status: "Absent" },
    { date: "2025-12-03", status: "Present" },
    { date: "2025-12-04", status: "Present" },
    { date: "2025-12-05", status: "Present" },
    { date: "2025-12-06", status: "Leave" },
    { date: "2025-12-07", status: "Present" },
    { date: "2025-12-08", status: "Present" },
    { date: "2025-12-09", status: "Absent" },
    { date: "2025-12-10", status: "Present" },
    { date: "2025-12-11", status: "Present" },
    { date: "2025-12-12", status: "Leave" },
    { date: "2025-12-13", status: "Present" },
    { date: "2025-12-14", status: "Present" },
    { date: "2025-12-15", status: "Absent" },
    { date: "2025-12-16", status: "Present" },
    { date: "2025-12-17", status: "Present" },
    { date: "2025-12-18", status: "Present" },
    { date: "2025-12-19", status: "Absent" },
    { date: "2025-12-20", status: "Present" },
  ]
};

function AttendanceDashboard() {
  const [selectedEmp, setSelectedEmp] = useState(employees[0].id);

  // 👉 Convert attendance to FullCalendar events
  const events =
    attendanceData[selectedEmp]?.map((item) => ({
      title: item.status,
      date: item.date,
      color:
        item.status === "Present"
          ? "#22c55e"
          : item.status === "Absent"
          ? "#ef4444"
          : "#3b82f6",
    })) || [];

  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-header">
        <h2>Attendance Dashboard</h2>

        {/* Employee selector */}
        <select
          className="emp-select"
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="attendance-legend">
        <div><span className="dot present"></span> Present</div>
        <div><span className="dot absent"></span> Absent</div>
        <div><span className="dot leave"></span> Leave</div>
      </div>

      {/* Calendar */}
      <div className="calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
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
