import React from "react";

const PopupModel = ({ selectedTx, setSelectedTx }) => {
  return (
    <div>
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
            {/* Top Brand / App Header */}
            <div className="bg-slate-100 px-6 py-3 border-b border-slate-200/60 flex justify-between items-center text-[11px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Payment Receipt</span>
              </div>
              <span className="text-slate-400">
                TRX ID: #{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            {/* Modal Green Header Section */}
            <div className="bg-green-500 text-white p-6 text-center relative">
              <button
                onClick={() => setSelectedTx(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-base font-bold w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Success Tick Icon */}
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white text-green-500 flex items-center justify-center text-2xl font-bold shadow-md">
                ✓
              </div>

              <h3 className="text-xs font-semibold text-green-100 uppercase tracking-widest">
                Transaction Successful
              </h3>
              <p className="text-3xl font-extrabold text-white mt-1">
                Rs. {Number(selectedTx.amount).toLocaleString()}
              </p>
            </div>

            {/* Receipt Body Details */}
            <div className="p-6 space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-sm font-bold ${
                    selectedTx.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : selectedTx.status === "FAILED"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {selectedTx.status}
                </span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <span className="text-slate-500">Paid By</span>
                <div className="text-right">
                  <div className="font-bold text-slate-800">
                    {selectedTx.fromHolderName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {selectedTx.fromAccountNumber}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">Sent To</span>
                <div className="text-right">
                  <div className="font-bold text-slate-800">
                    {selectedTx.toHolderName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {selectedTx.toAccountNumber}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">Description</span>
                <span className="font-medium text-slate-800 text-right max-w-[170px]">
                  {selectedTx.description || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transaction Type</span>
                <span className="font-semibold text-slate-700">
                  {selectedTx.type}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-medium text-slate-700">
                  {new Date(selectedTx.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-1">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-sm shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupModel;
