// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/LoginPage";
import HRLayout from "./layout/HRLayout";
import Dashboard from "./pages/Dashboard";
import CompanyUser from "./pages/CompanyUser";
import LeaveManager from "./pages/LeaveManager";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Payroll from "./pages/PayRoll";
import Activity from "./pages/Activity";
import Feedback from "./pages/FeedbackEmployees";
import EmployeePerformance from "./pages/EmployeePerformance";
import Recruitment  from "./Employees/Recruitment";

import Interviewer from "./Login/InterviewerPage";
import InterviewStart from "./Login/InterviewStart";
import InterviewEnd from "./Login/InterviewEnd";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All HR pages use same layout */}
        <Route path="/" element={<HRLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<CompanyUser />} />
          <Route path="leave" element={<LeaveManager />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="activity" element={<Activity />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="performance" element={<EmployeePerformance />} />

          <Route path="Recruitment" element={<Recruitment />} />
          {/* etc */}
        </Route>

        {/* Example: login page without navbar/sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Interviewer only */}
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/interview/start" element={<InterviewStart />} />
        <Route path="/end" element={<InterviewEnd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
