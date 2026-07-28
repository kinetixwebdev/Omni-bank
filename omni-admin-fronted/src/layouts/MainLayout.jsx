import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <main className="flex-1 overflow-x-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
