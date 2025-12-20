// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HRLayout from "./layout/HRLayout";
import Dashboard from "./pages/Dashboard";
import LeaveManager from "./pages/LeaveManager";
import CompanyUser from "./pages/CompanyUser";
import Payroll from "./pages/PayRoll";
import Feedback from "./pages/FeedbackEmployees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All HR pages use same layout */}
        <Route path="/" element={<HRLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leave" element={<LeaveManager />} />
          <Route path="users" element={<CompanyUser />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="feedback" element={<Feedback />} />
          {/* etc */}
        </Route>

        {/* Example: login page without navbar/sidebar */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
