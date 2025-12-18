// src/Employees/Recruitment.jsx
import React, { useState } from "react";
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

  const handleView = (id) => {
    alert(`View details for application ${id}`);
    // You can open a modal or navigate to detail page
  };

  const handleSchedule = (id) => {
    alert(`Schedule interview for application ${id}`);
    // You can open a date picker modal
  };

  const handleApprove = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "Hired" } : app
      )
    );
    alert(`Application ${id} approved - Candidate hired!`);
  };

  const handleReject = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "Rejected" } : app
      )
    );
    alert(`Application ${id} rejected`);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Pending": "status-pending",
      "Under Review": "status-review",
      "Interview Scheduled": "status-interview",
      "Hired": "status-hired",
      "Rejected": "status-rejected",
    };
    return statusMap[status] || "status-pending";
  };

  return (
    <div className="recruitment-page">
      <div className="recruitment-header">
        <div>
          <h2>Recruitment Management</h2>
          <p className="recruitment-breadcrumb">
            WorkforceHub / Employee / Recruitment
          </p>
        </div>
        <button className="btn btn-primary">Post New Job</button>
      </div>

      <div className="card recruitment-card">
        <div className="recruitment-card-header">
          <h3>Job Applications</h3>
        </div>

        <table className="recruitment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>CANDIDATE</th>
              <th>POSITION</th>
              <th>CONTACT</th>
              <th>EXPERIENCE</th>
              <th>STATUS</th>
              <th>APPLIED DATE</th>
              <th>INTERVIEW DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="emp-cell">
                    <div className="emp-avatar">
                      {app.name.charAt(0)}
                    </div>
                    <span>{app.name}</span>
                  </div>
                </td>
                <td>{app.position}</td>
                <td>
                  <div className="contact-info">
                    <div>{app.email}</div>
                    <div className="contact-phone">{app.phone}</div>
                  </div>
                </td>
                <td>{app.experience}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td>{app.appliedDate}</td>
                <td>{app.interviewDate}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-view"
                      onClick={() => handleView(app.id)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    {app.status !== "Hired" && app.status !== "Rejected" && (
                      <>
                        <button
                          className="btn btn-schedule"
                          onClick={() => handleSchedule(app.id)}
                          title="Schedule Interview"
                        >
                          📅
                        </button>
                        <button
                          className="btn btn-approve"
                          onClick={() => handleApprove(app.id)}
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => handleReject(app.id)}
                          title="Reject"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Recruitment;
