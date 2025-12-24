// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          <Route path="feedback" element={<Feedback />} />
          <Route path="Applications" element={<Recruitment />} />
          <Route path="activity" element={<Activity />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="AttendanceOverview" element={<AttendanceOverview/>} />
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
