import React, { useState } from "react";
import {
  FiCreditCard,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiSend,
  FiPlusCircle,
  FiTrendingUp,
  FiShield,
  FiCopy,
  FiMoreHorizontal,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiDownload,
  FiSettings,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Matrix from "../components/Dashboard/Matrix";
import AnalyticsChart from "../components/Dashboard/AnalyticsChart";
import RecentActivity from "../components/Dashboard/RecentActivity";
import VirtualCard from "../components/Dashboard/VirtualCard";
import QuikService from "../components/Dashboard/QuikService";
import SecurityWidget from "../components/Dashboard/SecurityWidget";

const Dashboard = () => {
  return (
    <div className="min-h-screen  p-4 md:p-8 text-slate-800">
      <header className="flex mb-10 flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, Mehmood! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here is what’s happening with your account today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Account Active
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column (Left 2 Cols) */}
          <main className="lg:col-span-2 space-y-6">
            {/* Top Metrics Row */}
            <Matrix />

            {/* Analytics Chart */}
            <AnalyticsChart />

            {/* Recent Activity */}
            <RecentActivity />
          </main>

          {/* Right Control Sidebar (1 Col) */}
          <aside className="space-y-6">
            {/* Debit Card Card */}
            <VirtualCard />

            {/* Account Quick Services */}
            <QuikService />

            {/* Security Widget */}
            <SecurityWidget />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
