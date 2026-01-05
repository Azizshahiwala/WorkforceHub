import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const UploadToUrl = "http://localhost:5000/api/RegisterForm";
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
  const [gender,setGender] = useState(null);
  const [personExperience, setpersonExperience] = useState(null)
  const [name, setName] = useState("")
  const handleEmail = (e) => {
    if(e.target.value.length >= 7 ){
      setEmail(e.target.value);
    }
  }

  const handlePhone = (e) => {
    //submit only if 10 or 12 digits
    if(e.target.value.length == 10 || e.target.value.length == 12 ){
      setPhoneNumber(e.target.value);
    }
  }

  const handleFileChange = (e) => {
    if(e.target.files.length == 1){
      setFile(e.target.files[0]);
    }
  }
  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    if(!selectedRole || !email || !phoneNumber || !file || !gender || !personExperience || !name){
      alert("Please fill required fields.");
      return;
    }
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
    <form className="Register-form" onSubmit={handleRegister}>
        
        <div className="SensitiveInfo">
          {/*Get sensitive stuff*/}
          <p>Enter your name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder="Eg. Marshal Dennis Ritche"/></p>
          <p>Enter your email: <input type="email" value={email} onChange={handleEmail} name="email" placeholder="Eg. abc@hotmail.com"/></p>
          <p>Enter your mobile: <input type="tel" value={phoneNumber} onChange={handlePhone} name="phoneNumber" placeholder="Eg. +91xxxxxxxxxx"/></p>
          <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Your Gender</option>
              <option key={1} value="Male">Male</option>
              <option key={2} value="Female">Female</option>
            </select>
        </div>
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
        <div className="ResumeUploadArea">
          {/*Upload resume here. .pdf and experience.*/}
          <input 
        type="file" 
        accept=".pdf" 
        name="file"
        onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}
          
        <p>Work experience: <input type="number" name="personExperience" onClick={(e) => setpersonExperience(e.target.value)}/> year(s)</p>
        </div>
        <button type="submit" onClick={handleRegister} className="Register-button">
          Register
        </button>
    </form>
}