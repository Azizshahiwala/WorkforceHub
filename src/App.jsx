// App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
/* ================= HR Layout ================= */
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

/* ================= Login ================= */
import Login from "./Login/LoginPage";
import Interviewer from "./Login/InterviewerPage";
import InterviewStart from "./Login/InterviewStart";
import InterviewEnd from "./Login/InterviewEnd";
import RegisterForm from "./Login/RegisterForm";
import ForgotPasswordPage from "./Misc/ForgotPasswordPage";
/* ================= Admin Layout ================= */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCompanyUser from "./pages/Admin/AdminCompanyUser";
import AdminFeedback from "./pages/Admin/AdminFeedback";
import AdminActivity from "./pages/Admin/AdminActivity";
import AdminEmployeePerformance from "./pages/Admin/AdminEmployeePerformance";

/* ================= Employee Layout ================= */
import EmployeeLayout from "./layout/EmployeeLayout";
import EmployeeDashboard from "./pages/Employees/EmployeeDashboard";
import ApplyLeave from "./pages/Employees/ApplyLeave";
import EmployeePersonalPerformance from "./pages/Employees/MyPerformance";
import EmployeeActivity from "./pages/Employees/EmployeeActivity";
import AssignTaskByHR from "./pages/Employees/AssignedTaskByHR";

/* ================= Main Content ================= */
function MainContent() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    /* ---------- Initialize DB (only once per reload) ---------- */
    const initDB = async () => {
      try {
        await fetch(`${API_BASE_URL}/init-db`);
      } catch (error) {
        console.error("DB Init failed", error);
      }
    };
    initDB();

    /* Check for sessions */
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem("MySession"));
    } catch (err) {
      console.error("Invalid session data");
    }

    if (session && location.pathname === "/") {
      const role = session.role?.toLowerCase();
      let targetPath = "";

      if (session.permission === 2 || session.permission === 3) {
        targetPath = "/dashboardEmployee";
      } else if (session.permission === 1) {
        targetPath = role === "hr" ? "/dashboard" : "/dashboardAdmin";
      }

      if (targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [navigate, location.pathname, API_BASE_URL]);

  return (
    <Routes>
      {/* ================= Auth Routes ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/RegisterForm" element={<RegisterForm />} />
      <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
      
      {/* ================= HR Routes ================= */}
      <Route path="/dashboard" element={<HRLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<CompanyUser />} />
        <Route path="leave" element={<LeaveManager />} />
        <Route path="attendance" element={<AttendanceDashboard />} />
        <Route path="attendance/attendanceOverview" element={<AttendanceOverview />}/>
        <Route path="payroll" element={<Payroll />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="applications" element={<Recruitment />} />
        <Route path="activity" element={<Activity />} />
        <Route path="assignTask" element={<AssignTask />} />
        <Route path="employeePerformance" element={<EmployeePerformance />}/>
      </Route>

      {/* ================= Admin Routes ================= */}
      <Route path="/dashboardAdmin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="usersAdmin" element={<AdminCompanyUser />} />
        <Route path="feedbackAdmin" element={<AdminFeedback />} />
        <Route path="activityAdmin" element={<AdminActivity />} />
        <Route
          path="performanceAdmin"
          element={<AdminEmployeePerformance />}
        />
      </Route>

      {/* ================= Employee Routes ================= */}
      <Route path="/dashboardEmployee" element={<EmployeeLayout />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="applyLeave" element={<ApplyLeave />} />
        <Route path="performance" element={<EmployeePersonalPerformance />}/>
        <Route path="activityEmployee" element={<EmployeeActivity />} />
        <Route path="assignedTaskByHR" element={<AssignTaskByHR />}/>
      </Route>

      {/* ================= Interview ================= */}
      <Route path="/interviewer" element={<Interviewer />} />
      <Route path="/interviewer/start" element={<InterviewStart />} />
      <Route path="/interviewer/end" element={<InterviewEnd />} />
    </Routes>
  );
}

/* ================= App Wrapper ================= */
function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}

export default App;
