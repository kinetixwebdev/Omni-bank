import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ComplaintsChart = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintStats();
  }, []);

  const fetchComplaintStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard/weekly-complaints",
        {
          withCredentials: true,
        },
      );

      // Default 7 days
      const defaultData = [
        { day: "Mon", resolved: 0, pending: 0 },
        { day: "Tue", resolved: 0, pending: 0 },
        { day: "Wed", resolved: 0, pending: 0 },
        { day: "Thu", resolved: 0, pending: 0 },
        { day: "Fri", resolved: 0, pending: 0 },
        { day: "Sat", resolved: 0, pending: 0 },
        { day: "Sun", resolved: 0, pending: 0 },
      ];

      // Merge backend response
      const mergedData = defaultData.map((day) => {
        const backendDay = response.data.find((d) => d.day === day.day);

        return backendDay
          ? {
              day: backendDay.day,
              resolved: Number(backendDay.resolved),
              pending: Number(backendDay.pending),
            }
          : day;
      });

      setComplaintsData(mergedData);
    } catch (error) {
      console.error("Failed to fetch complaint statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check agar poore 7 din mein total resolved + pending zero hai
  const hasNoComplaints =
    complaintsData.reduce(
      (acc, curr) => acc + curr.resolved + curr.pending,
      0,
    ) === 0;

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
            Complaints Resolution Ratio
          </h2>

          <p className="text-xs text-gray-400">
            Daily breakdown of resolved vs pending complaints.
          </p>
        </div>

        {!hasNoComplaints && (
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              Resolved
            </span>

            <span className="flex items-center gap-1 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
              Pending
            </span>
          </div>
        )}
      </div>

      {hasNoComplaints ? (
        <div className="w-full h-52 flex items-center justify-center text-sm font-medium text-emerald-600 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          No problems present in last 7 days
        </div>
      ) : (
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={complaintsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                domain={[0, (dataMax) => Math.max(dataMax + 1, 5)]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="resolved"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 4, 4]}
                barSize={20}
              />

              <Bar
                dataKey="pending"
                stackId="a"
                fill="#fb7185"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ComplaintsChart;
