import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const UploadToUrl = "http://localhost:5000/api/RegisterForm";

const validation = (email, phoneNumber, selectedRole,resume) => {

}
const roles = [
  { id: "Employee", label: "Employees"},
  { id: "Interviewer", label: "Interviewer"},
  { id: "Sales manager", label: "Sales manager"},
  { id: "Designer", label: "Designer"},
  { id: "Developer", label: "Developer"},
  { id: "Marketing", label: "Marketing"},
  { id: "Finance", label: "Finance"},
  { id: "Support", label: "Support"},
  { id: "Tester", label: "Tester"},
  { id: "Intern", label: "Intern"},
];
{/*Roles you cannot apply for*/}
const rolesYouCannotApplyFor = ["admin", "hr", "ceo"];

export default function RegisterForm() {
    const [selectedRole, setSelectedRole] = useState("");
    <form className="Register-form" onSubmit={validation}>
        <div className="roles">
          {roles.map((role) => (
            <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
            </div>
          ))}
        </div>
        <div className="SensitiveInfo">
          {/*Get email and phone number*/}
        </div>
        <div className="ResumeUploadArea">
          {/*Upload resume here. .pdf only*/}
        </div>
        <button type="submit" className="Register-button">
          Register
        </button>
    </form>
}