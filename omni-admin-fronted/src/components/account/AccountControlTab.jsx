import React from "react";

const AccountControlTab = ({
  activeTab = "ACTIVE",
  onTabChange = () => {},
  closedCount = 0,
  activeCount = 0,
  freezeCount = 0,
  deactivatedCount = 0,
}) => {
  const counts = {
    ACTIVE: activeCount,
    CLOSED: closedCount,
    FREEZE: freezeCount,
    DEACTIVATED: deactivatedCount,
  };

  const tabs = [
    { id: "ACTIVE", label: "Active" },
    { id: "CLOSED", label: "Closed" },
    { id: "FREEZE", label: "Frozen" },
    { id: "DEACTIVATED", label: "Deactivated" },
  ];

  return (
    <div className="flex border-b mb-6 bg-white px-4 pt-1 rounded-t-xl border-t border-x border-slate-200 overflow-hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-3 text-sm  font-medium border-b-2 whitespace-nowrap transition-all duration-150 flex items-center gap-2 mr-4 relative outline-none -mb-[2px] ${
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
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AccountControlTab;
