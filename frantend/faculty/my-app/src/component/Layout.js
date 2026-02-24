import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Layout() {
  return (
    <>
      <Sidebar />

      <div className="page-content">
        <Outlet />
      </div>

      <style>{`
        .page-content {
          min-height: 100vh;
          padding: 16px;
          transition: margin-left 0.25s ease;
        }

        /* Desktop */
        @media (min-width: 768px) {
          .page-content {
            margin-left: 260px;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .page-content {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
