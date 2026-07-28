import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardMatrix = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const icons = {
    "Total System Volume": "💰",
    "Total Registered Users": "👥",
    Complaints: "⚠️",
    "Active Accounts": "🏦",
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard/matrix",
        {
          withCredentials: true,
        },
      );

      const data = response.data.map((item) => ({
        ...item,
        icon: icons[item.title] || "📊",
      }));

      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {stat.title}
            </span>

            <span className="text-xl p-2 bg-slate-50 rounded-xl border border-slate-100">
              {stat.icon}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>

            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span
                className={`font-semibold ${
                  stat.isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {stat.change}
              </span>

              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default DashboardMatrix;
