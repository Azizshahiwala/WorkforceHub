import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageBox from "./MessageBox";
import "./UserConfig.css";

// role → level. Used for promote/demote preview and role modal grouping.
const ROLE_MAP = {
  "Intern":        1,
  "Tester":        1,
  "Support":       1,
  "Sales Manager": 2,
  "Designer":      2,
  "Developer":     2,
  "Marketing":     2,
  "Finance":       2,
  "HR":            3,
  "Admin":         4,
  "CEO":           4,
};

// Ordered list for next/prev role preview
const ROLE_HIERARCHY = [
  "Intern", "Tester", "Support",
  "Sales Manager", "Designer", "Developer", "Marketing", "Finance",
  "HR",
  "Admin", "CEO",
];

// Grouped by level for the role assignment modal — no loops, plain object
const ROLE_GROUPS = {
  1: ["Intern", "Tester", "Support"],
  2: ["Sales Manager", "Designer", "Developer", "Marketing", "Finance"],
  3: ["HR"],
  4: ["Admin", "CEO"],
};

export default function UserConfig() {
  const [loader,setloader] = useState(false);
  const { auth_id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState(null);
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role assignment modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem("MySession") || "{}");
    } catch {
      return {};
    }
  })();

  const isAdminOrHR = session.permission === 1;
  const isAdminOrCEO =
    isAdminOrHR &&
    ["admin", "ceo"].includes(String(session.role || "").toLowerCase());

  useEffect(() => {
    if (!isAdminOrHR) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/getCompanyUsers`,{method: 'GET',
  credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((u) => String(u.auth_id) === String(auth_id))
          : null;
        if (found) {
          setUser(found);
          setDepartment(found.department || "");
        } else {
          setMessage({ type: "Error", text: "User not found." });
        }
      })
      .catch(() => setMessage({ type: "Error", text: "Failed to load user." }))
      .finally(() => setLoading(false));
  }, [API_BASE_URL, auth_id, isAdminOrHR]);

  const getRoleIndex = (role) =>
    ROLE_HIERARCHY.findIndex(
      (r) => r.toLowerCase() === String(role || "").toLowerCase()
    );

  const getNextRole = (role) => {
    const idx = getRoleIndex(role);
    if (idx === -1 || idx === ROLE_HIERARCHY.length - 1) return role;
    return ROLE_HIERARCHY[idx + 1];
  };

  const getPrevRole = (role) => {
    const idx = getRoleIndex(role);
    if (idx <= 0) return role;
    return ROLE_HIERARCHY[idx - 1];
  };

  const updateUser = (action) => {
    if (!user) return;

    let url = "";
    let body = {};

    if (action === "promote") {
      url = `${API_BASE_URL}/promote/${auth_id}`;
      body = { amount: Number(amount) || 0, department: department || undefined };
    } else if (action === "demote") {
      url = `${API_BASE_URL}/demote/${auth_id}`;
      body = { amount: Number(amount) || 0, department: department || undefined };
    } else if (action === "bonus") {
      url = `${API_BASE_URL}/bonus/${auth_id}`;
      body = { amount: Number(amount) || 0 };
    }

    setLoading(true);
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage({ type: "Success", text: data.message });
          setUser((prev) => ({
            ...prev,
            BaseSalary: data.newSalary ?? prev.BaseSalary,
            department: department || prev.department,
            role: data.newRole ?? prev.role,
          }));
          setAmount("");
        } else {
          setMessage({ type: "Error", text: data.message || "Update failed." });
        }
      })
      .catch(() => setMessage({ type: "Error", text: "Update failed." }))
      .finally(() => setLoading(false));
  };

  const submitRoleChange = () => {
    if (!selectedRole) {
      setloader(false);
      setMessage({ type: "Error", text: "Please select a role." });
      return;
    }
    //This is to show loading while fetching
    setLoading(true);
    //This is for converting btn -> div.
    setloader(true);
    fetch(`${API_BASE_URL}/updateRole/${auth_id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole, department: department }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setMessage({ type: "Success", text: data.message });
          setUser((prev) => ({ ...prev, role: data.newRole || prev.role }));
          setShowRoleModal(false);
          setSelectedRole("");
          setloader(false);
        } else {
          setMessage({ type: "Error", text: data.message || "Role update failed. Try again later."});
          setloader(false);
        }
      })
      .catch(() => setMessage({ type: "Error", text: "Role update failed." }))
      .finally(() => setLoading(false));
      setloader(false);
  };

  if (!isAdminOrHR) {
    return (
      <div className="userconfig-denied">
        <h2>Access Denied</h2>
        <p>Only HR and Admin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="userconfig-page">
      <MessageBox message={message} onClose={() => setMessage(null)} />

      <div className="userconfig-header">
        <h2>User Configuration</h2>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>

      {loading && <p className="userconfig-loading">Loading...</p>}

      {user && (
        <div className="userconfig-card">

          <div className="userconfig-row">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>
          <div className="userconfig-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="userconfig-row">
            <span>Employee ID</span>
            <strong>{user.employeeId}</strong>
          </div>
          <div className="userconfig-row">
            <span>Current Role</span>
            <strong>{user.role}</strong>
          </div>
          <div className="userconfig-row">
            <span>Department</span>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
            />
          </div>
          <div className="userconfig-row">
            <span>Base Salary</span>
            <strong>₹ {user.BaseSalary ?? 0}</strong>
          </div>

          <hr className="userconfig-divider" />

          <div className="userconfig-row">
            <span>Salary Adjustment (₹)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="userconfig-actions">
            <button
              type="button"
              className="btn-promote"
              onClick={() => updateUser("promote")}
              disabled={loading}
            >
              Promote → {getNextRole(user.role)}
            </button>
            <button
              type="button"
              className="btn-demote"
              onClick={() => updateUser("demote")}
              disabled={loading}
            >
              Demote → {getPrevRole(user.role)}
            </button>
            <button
              type="button"
              className="btn-bonus"
              onClick={() => updateUser("bonus")}
              disabled={loading}
            >
              Apply Bonus
            </button>

            {isAdminOrCEO && (
              <button
                type="button"
                className="btn-role"
                onClick={() => {
                  setSelectedRole(user.role || "");
                  setShowRoleModal(true);
                }}
                disabled={loading}
              >
                Assign Role
              </button>
            )}
          </div>

          <p className="userconfig-hint">
            Promote / Demote moves the employee one level up or down and adjusts salary by the entered amount.
            Use Bonus to adjust salary without changing role.
            Role assignment is available to Admin and CEO only.
          </p>
        </div>
      )}

      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="role-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="role-modal-title">Assign Role — {user?.name}</h3>
            <p className="role-modal-current">
              Current: <strong>{user?.role}</strong>
            </p>

            {[1, 2, 3, 4].map((level) => (
              <div key={level} className="role-group">
                <small className="role-group-label">Level {level}</small>
                <ul className="role-list">
                  {ROLE_GROUPS[level].map((role) => (
                    <li key={role} className="role-list-item">
                      <label className="role-label">
                        <input
                          type="radio"
                          name="roleSelect"
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => setSelectedRole(role)}
                          className="role-radio"
                        />
                        {role}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="role-modal-actions">
              {loader ? <p className="btn-promote">Please wait</p> : 
              <button className="btn-promote" onClick={submitRoleChange} disabled={loading}>
                Confirm
              </button>}
              <button className="btn-demote" onClick={() => setShowRoleModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}