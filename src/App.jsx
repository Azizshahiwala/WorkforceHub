// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HRLayout from "./layout/HRLayout";
import Dashboard from "./pages/Dashboard";
import LeaveManager from "./pages/LeaveManager";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All HR pages use same layout */}
        <Route path="/" element={<HRLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leave" element={<LeaveManager />} />
          {/* <Route path="attendance" element={<EmployeeAttendance />} /> */}
          {/* <Route path="payroll" element={<Payroll />} /> */}
          {/* etc */}
        </Route>

        {/* Example: login page without navbar/sidebar */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
