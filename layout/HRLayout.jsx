// layout/HRLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../HR/Navbar";
import Sidebar from "../HR/Sidebar";
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
