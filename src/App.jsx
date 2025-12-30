// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import HRLayout from "./layout/HRLayout";
import Dashboard from "./pages/Dashboard";
import LeaveManager from "./pages/LeaveManager";
import CompanyUser from "./pages/CompanyUser";
import Payroll from "./pages/PayRoll";
import Feedback from "./pages/FeedbackEmployees";
import Recruitment from "./pages/Recruitment";
import Activity from "./pages/Activity";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import AttendanceOverview from "./pages/AttendanceOverview";
import EmployeePerformance from "./pages/EmployeePerformance";
import Login from "./Login/LoginPage";
import Interviewer from "./Login/InterviewerPage";
import InterviewStart from "./Login/InterviewStart";
import InterviewEnd from "./Login/InterviewEnd";

// Admin Layout import
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCompanyUser from "./pages/AdminCompanyUser";
import AdminFeedback from "./pages/AdminFeedback";
import AdminActivity from "./pages/AdminActivity";
import AdminEmployeePerformance from "./pages/AdminEmployeePerformance";

// Employee Layout import
import EmployeeLayout from "./layout/EmployeeLayout";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import Performance from "./pages/Performance";
import Announcements from "./pages/EmployeeActivity";

function App() {
  //This hook sends API request to the python flask end point: localhost/api/init-db
  //Which the flask uses CORS to validate the response. THEN, flask will run the database.py
  useEffect(() => {
    const initDB = async () => {
      try {
        //Get response into 'response'
        const response = await fetch("http://localhost:5000/api/init-db");
        //convert response to json
        const data = await response.json();
        console.log("Backend response:", data.message);
      } catch (error) {
        console.error("Failed to initialize database on startup:", error);
      }
    };

    initDB();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Login is now the index page */}
        <Route path="/" element={<Login />} />

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
          <Route path="attendance/AttendanceOverview" element={<AttendanceOverview/>} />
          <Route path="performance" element={<EmployeePerformance />} />
          {/*<Route path="*" element={<NotFoundPage />} />*/}
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
          <Route path="performanceEmployee" element={<Performance />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Interviewer routes remain the same or adjust as needed */}
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/interview/start" element={<InterviewStart />} />
        <Route path="/end" element={<InterviewEnd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
