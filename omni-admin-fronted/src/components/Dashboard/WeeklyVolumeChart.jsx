import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const WeeklyVolumeChart = () => {
  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyVolume();
  }, []);

  const fetchWeeklyVolume = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard/weekly-volume",
        {
          withCredentials: true,
        },
      );

      setVolumeData(response.data);
    } catch (error) {
      console.error("Failed to fetch weekly volume", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format dynamic Y-Axis labels
  const formatYAxis = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}K`;
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Weekly Transaction Volume
          </h2>
          <p className="text-xs text-gray-400">
            System ledger throughput over the last 7 days.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          Last 7 Days
        </span>
      </div>

      <div className="w-full h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={volumeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volumeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />

            {/* Dynamic YAxis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              domain={["auto", "auto"]}
              tickFormatter={formatYAxis}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                fontSize: "12px",
              }}
              formatter={(value) => [
                `Rs ${Number(value).toLocaleString()}`,
                "Volume",
              ]}
            />

            <Area
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#volumeColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyVolumeChart;
