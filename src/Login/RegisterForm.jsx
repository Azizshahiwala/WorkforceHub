import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const UploadToUrl = "http://localhost:5000/api/RegisterForm/applications/upload";
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
  const navigate = useNavigate();
  const [file, setFile] = useState(null)
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender,setGender] = useState("");
  const [personExperience, setpersonExperience] = useState("")
  const [name, setName] = useState("")
  const handleFileChange = (e) => {
    if(e.target.files.length == 1){
      setFile(e.target.files[0]);
    }
  }
  const handleRegister = async (e) => {
  e.preventDefault();
  if (!selectedRole || !email || !phoneNumber || !file || !gender || !personExperience || !name) {
      alert("Please fill all required fields correctly.");
      return;
    }

    if (phoneNumber.length !== 13) {
        alert("Phone number must be of 12 digits.");
        return;
    }
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('selectedRole', selectedRole);
    formData.append('gender', gender);
    formData.append('name', name);
    formData.append('personExperience', personExperience);

    const response = await fetch(UploadToUrl, {
      method: "POST",
      body: formData,
      });
      const data = await response.json();
      if(data.status === "Success".toLowerCase()){
      console.log("✅ Registration response:", data);
      localStorage.setItem("hasVisited", "true"); // Mark device as recognized
      navigate("/"); // Redirect to root which will now show Login
    }
    else{
      alert("Registration failed: " + data.message);
      return;
    }
    
  } catch (error) {
    console.error("❌ Registration error:", error);
  }
}   
  return (
    <div className="login-wrapper">
      <form className="Register-form" onSubmit={handleRegister}>
        <div className="SensitiveInfo">
          <p>Enter your name: 
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Eg. Marshal Dennis Ritche" />
          </p>
          <p>Enter your email: 
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Eg. abc@hotmail.com" />
          </p>
          <p>Enter your mobile: 
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Eg. +91xxxxxxxxxx" />
          </p>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Your Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="roles">
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
        </div>

        <div className="ResumeUploadArea">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          {file && <p>Selected file: {file.name}</p>}
          <p>Work experience: 
            <input type="number" value={personExperience} onChange={(e) => setpersonExperience(e.target.value)} /> year(s)
          </p>
        </div>

        <button type="submit" className="Register-button">
          Submit Application
        </button>
      </form>
    </div>
  );
}