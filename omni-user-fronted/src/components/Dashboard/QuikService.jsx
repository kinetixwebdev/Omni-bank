import React from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FiDownload, FiMoreHorizontal, FiSettings } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const QuikService = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white rounded-2xl border border-slate-200  p-6 space-y-4">
      <h2 className="text-base font-bold text-slate-900">Quick Management</h2>

      <div className="space-y-2">
        <button
          className="w-full cursor-pointer text-left p-3 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-between transition"
          onClick={() => {
            navigate("/transfer/money");
          }}
        >
          <div className="flex items-center gap-2.5">
            <FaMoneyBillTransfer className="w-4 h-4 text-slate-500" />
            <span>Send Money</span>
          </div>
        </button>
        <button
          className="w-full cursor-pointer text-left p-3 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-between transition"
          onClick={() => {
            navigate("/transactions");
          }}
        >
          <div className="flex items-center gap-2.5">
            <GrTransaction className="w-4 h-4 text-slate-500" />
            <span>See Transaction</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default QuikService;
