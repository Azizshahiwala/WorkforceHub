// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HRLayout from "./Layout/HRLayout";
import Dashboard from "./Pages/Dashboard";
import LeaveManager from "./Pages/LeaveManager";
import CompanyUser from "./Pages/CompanyUser";
import Payroll from "./Pages/PayRoll";
import Recruitment from "./Pages/Recruitment";
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
          <Route path="applications" element={<Recruitment />} />
          {/* etc */}
        </Route>

        {/* Example: login page without navbar/sidebar */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
