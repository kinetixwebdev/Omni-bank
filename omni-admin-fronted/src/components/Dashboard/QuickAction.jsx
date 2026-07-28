import React from "react";
import { useNavigate } from "react-router-dom";

const QuickAction = () => {
  const navigate = useNavigate();
  return (
    <aside className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 ">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
          Administrative Actions
        </h3>
        <div className="flex flex-col gap-2.5">
          <button
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between"
            onClick={() => {
              navigate("/user");
            }}
          >
            <span>🔒 Freeze / Unfreeze Account</span>
            <span className="text-gray-400">→</span>
          </button>

          <button
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between"
            onClick={() => {
              navigate("/hrlp-center");
            }}
          >
            <span>📋 Review Complaints & KYC</span>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 ">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-3">
          Infrastructure Health
        </h3>
        <div className="flex flex-col gap-3 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Database Replication:</span>
            <span className="text-emerald-600 font-semibold">Optimal</span>
          </div>
          <div className="flex justify-between items-center">
            <span>API Gateway Latency:</span>
            <span className="text-gray-900 font-mono font-medium">14ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Clearing House Node:</span>
            <span className="text-emerald-600 font-semibold">Synced</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default QuickAction;
