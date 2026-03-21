import React, { useState, useEffect } from "react";
import "../../styles/HR/Recruitment.css";
import MessageBox from "../../Misc/MessageBox";

function Recruitment() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // This usestate is to replace window.confirm because .confirm blocks message usestate.
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, isloading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState(null);

  // States for the Review & Admission Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    isloading(true);
    fetch(`${API_BASE_URL}/RegisterForm/applications`,{method: 'GET',
  credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        isloading(false);
      });
  };

  //Step 1:
  // Admit is set by Admitbtn 
  function Admit(Tempid) {
    setShowModal(false);
    setConfirmAction({ type: "admit", id: Tempid });
  }
  // Reject is set by Rejectbtn
  function Reject(Tempid) {
    setShowModal(false);
    setConfirmAction({ type: "reject", id: Tempid });
  }

  //Setp 2:
  // This creates a popup box for accept/reject. If accept -> admit else reject
  function handleConfirm() {
    if (confirmAction.type === "admit") {
      isloading(true);
      fetch(`${API_BASE_URL}/RegisterConfirm/${confirmAction.id}`, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setMessage({ type: "Success", text: "Account created. Employee can now log in." });
            setShowModal(false);
            fetchApplications();
          } else {
            setMessage({ type: "Error", text: data.message});
          }
          isloading(false);
          setConfirmAction(null);
        })
        .catch((err) => {
          console.error(err);
          isloading(false);
          setConfirmAction(null);
        });
    }
    else if (confirmAction.type === "reject") {
      isloading(true);
      fetch(`${API_BASE_URL}/recruit/reject/${confirmAction.id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((data) => {
          setApplications((prev) => prev.filter((item) => item.id !== confirmAction.id));
          isloading(false);
          setConfirmAction(null);
          setMessage({ type: "Success", text: data.message });
        })
        .catch((err) => {
          console.error(err);
          isloading(false);
          setConfirmAction(null);
        });
    }
    else {
      setConfirmAction(null);
    }
  }

  // Renamed from SendLink → Accept (send interview link is the acceptance step)
  function Accept(id, email, name) {
    isloading(true);
    fetch(`${API_BASE_URL}/recruit/send-invite/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, email: email, name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage({ type: "Success", text: data.message});
        isloading(false);
      })
      .catch((err) => {
        console.error("link error :", err);
        isloading(false);
      });
  }

  function showReport(id) {
    window.open(`${API_BASE_URL}/recruit/resume/${id}`, "_blank");
  }

  // Handle opening the results modal
  const handleViewAnalysis = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const filteredApps = applications.filter((app) => {
    if (filter === "Shortlisted") return parseInt(app.AI_SCORE) >= 7;
    if (filter === "Interviewed") return app.status === "Interviewed";
    return true;
  });

  return (
    <>
      <MessageBox message={message} onClose={() => setMessage(null)} />

      {/**Step 3: This confirmAction triggers if Admit / Reject is set. */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Action</h3>
            </div>
            <div className="modal-body">
              <p>
                {confirmAction.type === "admit" ?
                 "Create official employee account for this candidate?" : "Permanently reject this candidate?"}
              </p>
            </div>
            <div className="modal-footer">
              <button className="Admitbtn" onClick={handleConfirm}>Confirm</button>
              <button className="Rejbtn" onClick={() => setConfirmAction(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="recruitment-container">
        <table className="Inner-table" border={1} cellPadding={10} cellSpacing={0}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position for</th>
              <th>Email and Phone</th>
              <th>Experience</th>
              <th>Applied Date</th>
              <th>Report View</th>
              <th>Send for interview</th>
              <th>Status / AI Results</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((Submission, key) => (
              <tr key={Submission.id || key}>
                <td>{Submission.name}</td>
                <td>{Submission.position}</td>
                <td className="contact-info">
                  <span>{Submission.email}</span><br />
                  <span>{Submission.phone}</span>
                </td>
                <td>{Submission.experience}</td>
                <td>{Submission.appliedDate}</td>
                <td>
                  <button className="Repbtn" onClick={() => showReport(Submission.id)}>Resume</button>
                </td>
                <td className="action-btns">
                  <div className="button-group">
                    {loading ? (
                      <div className="loader-container">
                        <div className="loader"/>
                      </div>) : (<button
                        className="Accbtn"
                        onClick={() => Accept(Submission.id, Submission.email, Submission.name)}>
                        Send link
                      </button>
                    )}

                    {loading ? (<div className="loader-container">
                        <div className="loader"/>
                      </div>) : (<button
                        className="Rejbtn"
                        onClick={() => Reject(Submission.id)}>
                        Reject
                      </button>
                    )}
                  </div>
                </td>
                <td className={`status-badge ${Submission.status.toLowerCase()}`}>
                  {Submission.status === "Interviewed" ? (
                    <div className="interview-done-section">
                      <span>✅ Interview Done</span>
                      <button className="ViewAnalysisBtn" onClick={() => handleViewAnalysis(Submission)}>
                        View AI Analysis
                      </button>
                    </div>
                  ) : (
                    Submission.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedCandidate && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Evaluation: {selectedCandidate.name}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
            </div>
            <div className="modal-body">
              <div className="score-summary">
                <strong>Final AI Score:</strong>
                <span className="big-score"> {selectedCandidate.AI_SCORE} / 10</span>
              </div>
              <div className="transcript-section">
                <h4>Interview Transcript & Feedback</h4>
                <pre className="transcript-text">{selectedCandidate.AI_DESCRIPTION}</pre>
              </div>
            </div>
            <div className="modal-footer">
              {loading ? (
                <b className="processstage">Processing</b>) :
                (<button className="Admitbtn" onClick={() => Admit(selectedCandidate.id)}>
                  Admit & Create Account
                </button>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Recruitment;