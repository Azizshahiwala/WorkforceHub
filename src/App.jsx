// App.jsx
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect , useState} from "react";

import HRLayout from "./layout/HRLayout";
import Dashboard from "./pages/HR/Dashboard";
import LeaveManager from "./pages/HR/LeaveManager";
import CompanyUser from "./pages/HR/CompanyUser";
import Payroll from "./pages/HR/PayRoll";
import Feedback from "./pages/HR/FeedbackEmployees";
import Recruitment from "./pages/HR/Recruitment";
import Activity from "./pages/HR/Activity";
import AttendanceDashboard from "./pages/HR/AttendanceDashboard";
import AttendanceOverview from "./pages/HR/AttendanceOverview";
import EmployeePerformance from "./pages/HR/EmployeePerformance";
import AssignTask from "./pages/HR/AssignTask";

// Login Layout import
import Login from "./Login/LoginPage";
import Interviewer from "./Login/InterviewerPage";
import InterviewStart from "./Login/InterviewStart";
import InterviewEnd from "./Login/InterviewEnd";

// Admin Layout import
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCompanyUser from "./pages/Admin/AdminCompanyUser";
import AdminFeedback from "./pages/Admin/AdminFeedback";
import AdminActivity from "./pages/Admin/AdminActivity";
import AdminEmployeePerformance from "./pages/Admin/AdminEmployeePerformance";

// Employee Layout import
import EmployeeLayout from "./layout/EmployeeLayout";
import EmployeeDashboard from "./pages/Employees/EmployeeDashboard";
import ApplyLeave from "./pages/Employees/ApplyLeave";
import EmployeePersonalPerformance from "./pages/Employees/MyPerformance";
import EmployeeActivity from "./pages/Employees/EmployeeActivity";
import AssignTaskByHR from "./pages/Employees/AssignedTaskByHR";

//Entry point - Registration
import RegisterForm from "./Login/RegisterForm";

//This maincontent function seperates logic to 'remember' a device. 
function MainContent(){
  //we use navigate because <BrowserComponent> has its child useNavigate.

  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  //This hook sends API request to the python flask end point: localhost/api/init-db
  //Which the flask uses CORS to validate the response. THEN, flask will run the database.py  
  useEffect(() => {
    // Initialize DB (only once)
    const initDB = async () => {
      try {
        await fetch(`${API_BASE_URL}/init-db`);
      } catch (error) {
        console.error("DB Init failed", error);
      }
    };
    initDB();

    // 2. Check if i find a session.
    const session = JSON.parse(localStorage.getItem("MySession"));
    if (session) {
      const role = session.role.toLowerCase();
      let targetPath = "";

    //Also check permission. Then navigate according to the paths 
      if (session.permission === 2 || session.permission === 3) targetPath = "/dashboardEmployee";
      else if (session.permission === 1) {
        targetPath = (role === "hr") ? "/dashboard" : "/dashboardAdmin";
      }

      //Check if path is not '/'. this prevents infinite hook render
      
      if (targetPath && location.pathname === "/") {
        navigate(targetPath, { replace: true });
      }
    }
  }, []);


  return (
    <Routes>
      <Route path="/RegisterForm" element={<RegisterForm />} />
      <Route path="/" element={<Login />} />
      {/* ... all other routes ... */}
    {/* 2. Move HR Layout to /dashboard */}
        <Route path="/dashboard" element={<HRLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<CompanyUser />} />
          <Route path="leave" element={<LeaveManager />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="Applications" element={<Recruitment />} />
          <Route path="activity" element={<Activity />} />
          <Route path="assignTask" element={<AssignTask />} />
          <Route path="attendance/AttendanceOverview" element={<AttendanceOverview/>} />
          <Route path="EmployeePerformance" element={<EmployeePerformance />} />
        </Route>


        {/* 3. Move Admin Layout to /dashboard */}
        <Route path="/dashboardAdmin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usersAdmin" element={<AdminCompanyUser />} />
          <Route path="feedbackAdmin" element={<AdminFeedback />} />
          <Route path="activityAdmin" element={<AdminActivity />} />
          <Route path="performanceAdmin" element={<AdminEmployeePerformance />} />
        </Route>

        {/* 4. Move Employee Layout to /dashboard */}
        <Route path="/dashboardEmployee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="applyLeave" element={<ApplyLeave />} />
          <Route path="performanceEmployee" element={<EmployeePersonalPerformance />} />
          <Route path="activityEmployee" element={<EmployeeActivity />} />
          <Route path="assignedTaskByHR" element={<AssignTaskByHR />} />
        </Route>

        {/* Interviewer routes remain the same or adjust as needed */}
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/interview/start" element={<InterviewStart />} />
        <Route path="/end" element={<InterviewEnd />} />
      </Routes>
  );
}
function App() {
  return (
    <BrowserRouter>
      <MainContent></MainContent>  
    </BrowserRouter>
  );
}

export default App;
