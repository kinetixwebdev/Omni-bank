import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import DashboardMatrix from "../components/Dashboard/DashboardMatrix";
import TransactionList from "../components/Dashboard/TransactionList";
import QuickAction from "../components/Dashboard/QuickAction";
import WeeklyVolumeChart from "../components/Dashboard/WeeklyVolumeChart";
import ComplaintsChart from "../components/Dashboard/ComplaintsChart";

// Main Admin Dashboard
const AdminDashboard = () => {
  return (
    <div className="min-h-screen  text-gray-800 font-sans antialiased py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* HEADER SECTION */}
        <header className="bg-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Banking Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Overview of core ledger metrics, account statuses, and system
              throughput.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Core System Online
            </span>
          </div>
        </header>

        <DashboardMatrix />

        {/* RECHARTS SECTION (2 GRAPHS) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeeklyVolumeChart />
          <ComplaintsChart />
        </section>

        {/* MAIN BODY: Recent Activity Table & Quick Admin Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* LEFT PANEL: Transaction Ledger Overview */}
          <TransactionList />

          {/* RIGHT PANEL: Quick Action Controls */}
          <QuickAction />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
