import React from "react";

const UserControlTab = ({
  activeTab = "ALL",
  onTabChange = () => {},
  pendingCount = 0,
  rejectedCount = 0,
  activeCount = 0,
  freezeCount = 0,
  deactivatedCount = 0,
}) => {
  const counts = {
    ACTIVE: activeCount,
    PENDING: pendingCount,
    FREEZE: freezeCount,
    DEACTIVATED: deactivatedCount,
    REJECTED: rejectedCount,
  };

  const tabs = [
    { id: "ACTIVE", label: "Active" },
    { id: "PENDING", label: "Pending Verification" },
    { id: "FREEZE", label: "Frozen" },
    { id: "DEACTIVATED", label: "Deactivated" },
    { id: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="flex border-b mb-6 bg-white px-4 pt-1 rounded-t-xl border-t border-x border-slate-200 overflow-x-auto scrollbar-none w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const currentCount = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 mr-4 relative outline-none -mb-[2px] ${
              isActive
                ? "border-slate-800 text-slate-900 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
            }`}
          >
            {tab.label}

            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                isActive ? "bg-slate-100" : "bg-slate-100 text-slate-500"
              }`}
            >
              {currentCount.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default UserControlTab;
