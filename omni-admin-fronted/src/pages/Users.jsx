import React, { useEffect, useState } from "react";
import PendingUser from "../components/user/UserList";
import UserMetrixBar from "../components/user/UserMetrixBar";
import UserControlTab from "../components/user/UserControlTab";
import axios from "axios";

const Users = () => {
  const [metrics, setMetrics] = useState({
    pendingCount: 0,
    rejectedCount: 0,
    activeCount: 0,
    freezeCount: 0,
    deactivatedCount: 0,
  });

  const [selectedStatus, setSelectedStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8080/api/v1/admin/user/matrix",
          {
            withCredentials: true,
          },
        );

        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleTabChange = (tab) => {
    if (tab === selectedStatus) return;
    setSelectedStatus(tab);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage, approve, and review user account statuses.
        </p>
      </div>

      <UserMetrixBar
        pendingCount={metrics.pendingCount}
        rejectedCount={metrics.rejectedCount}
        activeCount={metrics.activeCount}
        freezeCount={metrics.freezeCount}
        deactivatedCount={metrics.deactivatedCount}
        selectedStatus={selectedStatus}
        loading={loading}
      />

      <UserControlTab
        activeTab={selectedStatus}
        onTabChange={handleTabChange}
        activeCount={metrics.activeCount}
        pendingCount={metrics.pendingCount}
        freezeCount={metrics.freezeCount}
        deactivatedCount={metrics.deactivatedCount}
        rejectedCount={metrics.rejectedCount}
      />

      <PendingUser selectedStatus={selectedStatus} />
    </div>
  );
};

export default Users;
