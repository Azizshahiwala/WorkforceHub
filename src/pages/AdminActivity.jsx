import React, { useState } from "react";
import "./Activity.css";

const data = [
  { time: "30 mins ago", text: "Leave request submitted by Ankit" },
  { time: "5 hr ago", text: "Payroll processed for December" },
  { time: "10 hr ago", text: "New employee added: Riya" },
  { time: "Yesterday", text: "Task assigned to IT team" },
  { time: "Thrusday", text: "Holiday added: Christmas" },
];

function Activity() {
  const [activities, setActivities] = useState(data);
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addNewTask = () => {
    if (!newTask.trim()) return;

    const newActivity = {
      time: "Just now",
      text: newTask,
    };

    setActivities([newActivity, ...activities]);
    setNewTask("");
    setShowModal(false);
  };

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>Activity Dashboard</h2>
        <button className="activity-btn" onClick={() => setShowModal(true)}>
          + New Activity
        </button>
      </div>

      <div className="activity-list">
        {activities.map((item, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            {index !== activities.length - 1 && (
              <div className="activity-line"></div>
            )}
            <div className="activity-content">
              <span className="activity-time">{item.time}</span>
              <p className="activity-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Add New Activity</h4>
            <textarea
              className="modal-textarea"
              placeholder="Enter activity..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="modal-add" onClick={addNewTask}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activity;