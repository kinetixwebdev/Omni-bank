import React from "react";

const UserMetrixBar = ({
  pendingCount = 0,
  rejectedCount = 0,
  activeCount = 0,
  freezeCount = 0,
  deactivatedCount = 0,
  selectedStatus = "ALL",
  loading = false,
}) => {
  const metricList = [
    {
      id: "ACTIVE",
      label: "Active Accounts",
      count: activeCount,
      borderColor: "border-l-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      id: "PENDING",
      label: "Pending Verification",
      count: pendingCount,
      borderColor: "border-l-amber-500",
      textColor: "text-amber-600",
    },
    {
      id: "FREEZE",
      label: "Compliance Hold",
      count: freezeCount,
      borderColor: "border-l-blue-500",
      textColor: "text-blue-600",
    },
    {
      id: "DEACTIVATED",
      label: "Deactivated Access",
      count: deactivatedCount,
      borderColor: "border-l-slate-400",
      textColor: "text-slate-600",
    },
    {
      id: "REJECTED",
      label: "Rejected Apps",
      count: rejectedCount,
      borderColor: "border-l-rose-500",
      textColor: "text-rose-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full my-6">
      {metricList.map((item) => {
        const isSelected = selectedStatus === item.id;

        return (
          <button
            key={item.id}
            className={`p-4 text-left cursor-pointer rounded-xl border border-l-4  bg-white transition-all duration-200
              ${item.borderColor}
              ${
                isSelected
                  ? "border-slate-200"
                  : "border-slate-200 hover:border-slate-300 hover:shadow"
              }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {item.label}
            </div>

            <div className={`text-2xl font-bold mt-2 ${item.textColor}`}>
              {item.count}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default UserMetrixBar;
