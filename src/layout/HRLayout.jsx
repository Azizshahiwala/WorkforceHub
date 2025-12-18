// layout/HRLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./HRLayout.css";

function HRLayout() {
  return (
    <>
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default HRLayout;
