import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";

const AnalyticsChart = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/dashboard/chart",
        {
          withCredentials: true,
        },
      );

      setExpenseData(response.data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  const tooltipStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  };

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Cash Flow Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Monthly income vs expenses breakdown
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            Income
          </span>

          <span className="flex items-center gap-1.5 text-rose-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Expenses
          </span>
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={expenseData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5ABA81" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5ABA81" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [
                `Rs ${Number(value).toLocaleString()}`,
                "",
              ]}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#5ABA81"
              strokeWidth={2}
              fill="url(#incomeGradient)"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AnalyticsChart;
