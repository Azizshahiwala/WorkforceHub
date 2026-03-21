import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { Link } from "react-router-dom";
import MessageBox from "../Misc/MessageBox";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const roles = [
  { id: "Sales manager", label: "Sales manager",BaseSalary:62000},
  { id: "Designer", label: "Designer", BaseSalary:45000},
  { id: "Developer", label: "Developer", BaseSalary:55000},
  { id: "Marketing", label: "Marketing", BaseSalary:48000},
  { id: "Finance", label: "Finance", BaseSalary:58000},
  { id: "Support", label: "Support", BaseSalary:38000},
  { id: "Tester", label: "Tester", BaseSalary:42000},
  { id: "Intern", label: "Intern", BaseSalary:18000},
];
{/*Roles you cannot apply for*/}
const rolesYouCannotApplyFor = ["admin", "hr", "ceo"];

export default function RegisterForm() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null)
  const [selectedRole, setSelectedRole] = useState("Intern");
  const [selectedSal,setselectedSal] = useState(0);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender,setGender] = useState("");
  const [personExperience, setpersonExperience] = useState("");
  const [name, setName] = useState("");
  const [message,setMessage] = useState(null);
  const handleRoleChange = (e) => {
  const roleId = e.target.value;
  setSelectedRole(roleId);
  
  //Now find the object which has r.id
  const roleObj = roles.find(r => r.id === roleId);
  if (roleObj) {
    setselectedSal(roleObj.BaseSalary);
  } else {
    setselectedSal(0);
  }
};

  const handleFileChange = (e) => {
    if(e.target.files.length == 1){
      setFile(e.target.files[0]);
    }
  }
  const handleRegister = async (e) => {
  e.preventDefault();
  if (!selectedRole || !email || !phoneNumber || !file || !gender || !personExperience || !name) {
      setMessage({type:"Info",text:"Please fill all required fields correctly."});
      return;
    }

    let countrycodesyntax = (phoneNumber.includes("+") && phoneNumber.charAt(0) == "+");
    if (phoneNumber.length !== 13 && !countrycodesyntax) {
        setMessage({type:"Info",text:"Phone number must be of this syntax: +01xxxxxxxxxx"});
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
    formData.append('selectedSal',selectedSal)
    const response = await fetch(`${API_BASE_URL}/RegisterForm/applications/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
      });
      const data = await response.json();
      if(data.status === "Success".toLowerCase()){
      console.log("✅ Registration response:", data);
      localStorage.setItem("hasVisited", "true"); // Mark device as recognized
      navigate("/"); // Redirect to root which will now show Login
    }
    else{
      setMessage({type:"Error",text:"Registration failed: " + data.message});
      return;
    }
    
  } catch (error) {
    console.error("Registration error:", error);
    setMessage({type:"Error",text:"Registration error:", error});
  }
}   
  return (
    <div className="login-wrapper">
      <MessageBox message={message} onClose={() => setMessage(null)}/>
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
    <select value={selectedRole} onChange={handleRoleChange}>
      <option value="">Select Role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.label} (Base Salary: ₹{role.BaseSalary})
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
        <Link to="/">Already have an account? Click here</Link>
        
      </form>
    </div>
  );
}