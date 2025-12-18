// src/Employees/Recruitment.jsx
import React, { useState,useEffect } from "react";
import "./Recruitment.css";

const initialApplications = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Developer",
    email: "sarah.j@email.com",
    phone: "+1 234-567-8900",
    experience: "5 years",
    status: "Interview Scheduled",
    appliedDate: "15 Dec, 2025",
    interviewDate: "22 Dec, 2025",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Frontend Developer",
    email: "michael.c@email.com",
    phone: "+1 234-567-8901",
    experience: "3 years",
    status: "Under Review",
    appliedDate: "14 Dec, 2025",
    interviewDate: "-",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "HR Manager",
    email: "emily.r@email.com",
    phone: "+1 234-567-8902",
    experience: "7 years",
    status: "Hired",
    appliedDate: "10 Dec, 2025",
    interviewDate: "18 Dec, 2025",
  },
  {
    id: 4,
    name: "David Park",
    position: "Full Stack Developer",
    email: "david.p@email.com",
    phone: "+1 234-567-8903",
    experience: "4 years",
    status: "Rejected",
    appliedDate: "12 Dec, 2025",
    interviewDate: "19 Dec, 2025",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    position: "UI/UX Designer",
    email: "lisa.t@email.com",
    phone: "+1 234-567-8904",
    experience: "2 years",
    status: "Pending",
    appliedDate: "16 Dec, 2025",
    interviewDate: "-",
  },
];

function Recruitment() {
  const [applications, setApplications] = useState(initialApplications);

  return (<>
  <div>

    <table></table>
  </div>
  </>);
}
export default Recruitment;
