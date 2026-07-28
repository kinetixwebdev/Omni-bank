import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getLatestTransactions();
  }, []);

  const getLatestTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard/transactions",
        {
          withCredentials: true,
        },
      );

      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch latest transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Recent System Transactions
          </h2>
          <p className="text-xs text-gray-400">
            Live feed of domestic wires and internal transfers.
          </p>
        </div>

        <button
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          onClick={() => {
            navigate("/user");
          }}
        >
          View All →
        </button>
      </div>

      <div>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">From Account</th>
                  <th className="px-6 py-3.5">To Account</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {transaction.fromHolderName}
                      </div>
                      <div className="text-slate-500">
                        {transaction.fromAccountNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {transaction.toHolderName}
                      </div>
                      <div className="text-slate-500">
                        {transaction.toAccountNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      Rs. {Number(transaction.amount).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          transaction.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 font-medium">
              No verified transactions logged for this ledger entity.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
