import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RecentActivity = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/transactions",
        {
          withCredentials: true,
        },
      );
      setRecentTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-6 ">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing latest 5 transfers
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors group"
          onClick={() => {
            navigate("/transactions");
          }}
        >
          <span>View All</span>
          <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Table Section */}
      {recentTransactions.length > 0 ? (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase  text-slate-400 font-bold">
                <th className="pl-6 pr-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="pr-6 pl-4 py-3 ">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentTransactions.slice(0, 5).map((txn, index) => {
                const isCredit =
                  txn.type === "DEPOSIT" ||
                  txn.type === "CREDIT" ||
                  txn.type === "RECEIVED";

                return (
                  <tr
                    key={txn.id || index}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* From Account */}
                    <td className="pl-6 pr-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 ${
                            isCredit
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isCredit ? (
                            <FiArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <FiArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                            {txn.fromHolderName || "N/A"}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {txn.fromAccountNumber || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* To Account */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {txn.toHolderName || "N/A"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {txn.toAccountNumber || "—"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-bold text-slate-900 text-sm whitespace-nowrap">
                      Rs. {Number(txn.amount).toLocaleString()}
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider">
                        {txn.type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="pr-6 pl-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          txn.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : txn.status === "FAILED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            txn.status === "SUCCESS"
                              ? "bg-emerald-500"
                              : txn.status === "FAILED"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                          }`}
                        />
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium text-xs">
            No transactions found
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Your recent account transfers will appear here.
          </p>
        </div>
      )}
    </section>
  );
};

export default RecentActivity;
