import React, { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const Matrix = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/user/dashboard/matrix",
        {
          withCredentials: true,
        },
      );

      setData([
        {
          title: "Monthly Income",
          amount: res.data.monthlyIncome,
          change: res.data.incomeChange,
        },
        {
          title: "Monthly Expenses",
          amount: res.data.monthlyExpenses,
          change: res.data.expenseChange,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              {item.title}
            </span>

            <div
              className={`p-2.5 rounded-xl ${
                index === 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {index === 0 ? (
                <FiArrowDownLeft className="w-5 h-5" />
              ) : (
                <FiArrowUpRight className="w-5 h-5" />
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">
              {item.amount}
            </div>

            <div
              className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                index === 0 ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {index === 0 && <FiTrendingUp className="w-3.5 h-3.5" />}
              <span>{item.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Matrix;
