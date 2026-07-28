import React, { useEffect, useState } from "react";
import axios from "axios";
import PopupModel from "../components/PopupModel";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null); // Selected transaction for modal

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/transactions",
        {
          withCredentials: true,
        },
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading transactions...
      </div>
    );

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Recent Transactions
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                {transactions?.length || 0} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor and track all your incoming and outgoing payments in
              real-time.
            </p>
          </div>
        </div>
        <div className="w-full bg-white rounded-lg border border-slate-200/80  overflow-hidden">
          {transactions && transactions.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                {/* Table Header */}
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200/60">
                  <tr>
                    <th className="px-6 py-4">From Account</th>
                    <th className="px-6 py-4">To Account</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Date & Time</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 font-normal">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedTx(transaction)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-all duration-150 group"
                    >
                      {/* From Account */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                          {transaction.fromHolderName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {transaction.fromAccountNumber}
                        </div>
                      </td>

                      {/* To Account */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {transaction.toHolderName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {transaction.toAccountNumber}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-xs ">
                          Rs. {Number(transaction.amount).toLocaleString()}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide">
                          {transaction.type}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === "SUCCESS"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : transaction.status === "FAILED"
                                ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              transaction.status === "SUCCESS"
                                ? "bg-emerald-500"
                                : transaction.status === "FAILED"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          {transaction.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium text-slate-400">
                        {new Date(transaction.createdAt).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-slate-50/50">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                💳
              </div>
              <p className="text-slate-600 font-semibold text-sm">
                No Transactions Found
              </p>
              <p className="text-slate-400 text-xs mt-1">
                There are no verified transactions logged for this account yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Pop-up Receipt Modal */}
      <PopupModel setSelectedTx={setSelectedTx} selectedTx={selectedTx} />
    </div>
  );
};

export default Transaction;
