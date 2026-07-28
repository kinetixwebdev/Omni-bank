import axios from "axios";
import React, { useEffect, useState } from "react";
import AccountControlTab from "../components/account/AccountControlTab";
import AccountMatrixBar from "../components/account/AccountMatrixBar";
import AccountList from "../components/account/AccountList";

const Accounts = () => {
  const [metrics, setMetrics] = useState({
    closedCount: 0,
    activeCount: 0,
    freezeCount: 0,
    deactivatedCount: 0,
  });

  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8080/api/v1/admin/account/matrix",
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
    <div className="w-full h-screen  overflow-x-auto">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Management</h1>
          <p className="text-sm text-gray-500">Manage account statuses.</p>
        </div>

        <AccountMatrixBar
          closedCount={metrics.closedCount}
          activeCount={metrics.activeCount}
          freezeCount={metrics.freezeCount}
          deactivatedCount={metrics.deactivatedCount}
          selectedStatus={selectedStatus}
          loading={loading}
          onCardClick={handleTabChange}
        />

        <AccountControlTab
          activeTab={selectedStatus}
          onTabChange={handleTabChange}
          closedCount={metrics.closedCount}
          activeCount={metrics.activeCount}
          freezeCount={metrics.freezeCount}
          deactivatedCount={metrics.deactivatedCount}
        />

        <AccountList selectedStatus={selectedStatus} />
      </div>
    </div>
  );
};

export default Accounts;
