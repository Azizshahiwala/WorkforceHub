import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AttendanceDashboard.css";
import {Link} from "react-router-dom";

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
  const [Myevent, setMyEvents] = useState([]);
    //Since code is mutating useEffect, we do the following:
    useEffect(() => {
    // Fetch indian holidays from open source API
    const fetchHoliday = async () => {
        try {
            // get response
            const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/IN");
            
            //get response text
            const text = await response.text();

            //Now parse text to json
            const data = JSON.parse(text);

            // To map, we create a blue box (or orange as specified), same as entry:
            const PreDefinedHolidays = data.map((holiday) => ({
            id: `holiday-${holiday.date}`,
            title: holiday.name,
            date: holiday.date,
            backgroundColor: "orange",
            textColor: "black",   // ✅ FORCE text
            allDay: true,
            editable: false
}));

            // Since FullCalendar takes single event param, we append this
            // We use a functional update to prevent duplicates if the component re-renders
            setMyEvents(oldData => {
                // Optional: filter out existing holidays to prevent duplicates on re-mount
                const existingDates = new Set(oldData.map(e => e.date));
                const uniqueNewHolidays = PreDefinedHolidays.filter(h => !existingDates.has(h.date));
                return [...oldData, ...uniqueNewHolidays];
            });

        } catch (error) {
            console.error("Error fetching holidays:", error);
        }
    };

    fetchHoliday();
}, []);

  useEffect(()=>{
    const AttendanceEvents =
    attendanceData[selectedEmp]?.map((item) => ({
      id: `att-${selectedEmp}-${item.date}`,
      title: item.status,
      date: item.date,
      color:
        item.status === "Present"
          ? "#22c55e"
          : item.status === "Absent"
          ? "#ef4444"
          : "#3b82f6",
    })) || [];
    setMyEvents(prev=>{

      // keep holidays, remove old attendance
    const nonAttendance = prev.filter(
      e => !e.id?.startsWith("att-")
    );
      return [...nonAttendance, ...AttendanceEvents];
    });
  },[selectedEmp]);

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
      <div>
        <Link to="./AttendanceOverview" className="OverviewBtn">Click here to get overview</Link>
      </div>
      {/* Calendar */}
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
