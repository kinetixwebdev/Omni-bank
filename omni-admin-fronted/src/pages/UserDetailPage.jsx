import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/user/detail/${id}`,
        {
          withCredentials: true,
        },
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      const backendError =
        err.response?.data?.message || "Failed to load user details.";
      toast.error(backendError);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/user/status`,
        null, // No request body needed, so we pass null
        {
          params: { id: id, status: newStatus }, // Sends ?status=YOUR_STATUS in the URL
          withCredentials: true,
        },
      );

      // Refresh component data with updated backend state
      await fetchUser();
    } catch (err) {
      console.error(`Failed to update user status to ${newStatus}:`, err);
      // Grab backend custom error message if it exists, otherwise fallback safely
      const backendError =
        err.response?.data?.message ||
        "Error processing action status change request.";
      toast.error(backendError);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2  border-blue-600"></div>
      </div>
    );
  }

  const { userDetail, accountDetail, transactions } = data;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 font-sans antialiased text-slate-600">
      {/* Toast container injects notifications into view */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            User Management Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Admin Dashboard &bull; User Insights
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
            userDetail.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : userDetail.status === "PENDING"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {userDetail.status}
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RIGHT SIDE: PROFILE VIEW & ACCOUNT INFO */}
        <div className="lg:col-span-4 space-y-6 lg:order-1 order-2">
          {/* User Profile Overview */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50 relative">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-900 text-white font-bold text-lg tracking-wider mb-3 shadow-xs">
                {getInitials(userDetail.name)}
              </div>

              <span
                className={`px-3 py-1 rounded-full absolute right-6 top-6 text-xs font-semibold tracking-wide ${
                  userDetail.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : userDetail.status === "PENDING"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {userDetail.status}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {userDetail.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">
                ID: {userDetail.id}
              </p>
            </div>

            {/* Profile Meta Details */}
            <div className="p-5 space-y-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </span>
                <span className="text-slate-800 break-all font-medium">
                  {userDetail.email}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Phone
                  </span>
                  <span className="text-slate-800 font-medium">
                    {userDetail.phoneNumber || "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    CNIC Number
                  </span>
                  <span className="text-slate-800 font-medium">
                    {userDetail.cnicNumber || "—"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Verification
                  </span>
                  <div>
                    {userDetail.emailVerified ? (
                      <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-xs inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Joined Date
                  </span>
                  <span className="text-slate-500 text-xs mt-0.5 font-medium">
                    {new Date(userDetail.createdAt).toLocaleDateString(
                      undefined,
                      { dateStyle: "medium" },
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC ADMINISTRATIVE ACTIONS CARD */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Administrative Actions
            </h4>
            <div className="flex flex-col gap-2">
              {/* PENDING STATE */}
              {userDetail.status === "PENDING" && (
                <>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("activate")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300 font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Activate User Profile
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("reject")}
                    className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 disabled:border-slate-200 disabled:text-slate-400 font-semibold py-2 px-4 rounded-lg text-xs transition-colors"
                  >
                    Reject Application
                  </button>
                </>
              )}

              {/* ACTIVE STATE */}
              {userDetail.status === "ACTIVE" && (
                <>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("deactivate")}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 disabled:text-slate-400 font-semibold py-2 px-4 rounded-lg text-xs transition-colors"
                  >
                    Deactivate Identity
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("freeze")}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 disabled:bg-slate-50 disabled:text-slate-400 font-semibold py-2 px-4 rounded-lg text-xs transition-colors"
                  >
                    Freeze Financial Asset Access
                  </button>
                </>
              )}

              {/* DEACTIVATED STATE */}
              {userDetail.status === "DEACTIVATED" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange("activate")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300 font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Activate User Profile
                </button>
              )}

              {/* FROZEN STATE */}
              {userDetail.status === "FREEZE" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange("activate")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Unfreeze Financial Asset Access
                </button>
              )}

              {/* Fallback info if state doesn't accept actions (e.g., REJECTED) */}
              {["PENDING", "ACTIVE", "DEACTIVATED", "FREEZE"].indexOf(
                userDetail.status,
              ) === -1 && (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  No active administrative workflows available for this profile
                  status.
                </p>
              )}
            </div>
          </div>

          {/* Account Detail Card */}
          {accountDetail != null ? (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Account Architecture
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-100">
                  {accountDetail.status || "Active"}
                </span>
              </div>

              <div className="p-5">
                {/* Premium Balance Card View */}
                <div className="relative p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md mb-5 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <svg
                      className="w-24 h-24 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21M12 16H22V8H12V16M16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12 17.5 12.83 16.83 13.5 16 13.5Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                    Available Portfolio Balance
                  </span>
                  <span className="text-2xl font-black tracking-tight text-emerald-400 font-mono">
                    Rs.{" "}
                    {accountDetail.balance?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) || "0.00"}
                  </span>
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                        Account Number
                      </span>
                      <span className="font-mono text-sm tracking-widest font-semibold text-slate-200">
                        {accountDetail.accountNumber || "•••• •••• ••••"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-tier specs */}
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">System Core ID</span>
                    <span className="text-slate-700 font-mono text-[11px] select-all">
                      {accountDetail.id || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">Designated Holder</span>
                    <span className="text-slate-800 font-bold">
                      {accountDetail.holderName || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white flex min-h-36 items-center justify-center rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
              <p className="font-semibold text-xs text-slate-400">
                No account associated with this User
              </p>
            </div>
          )}
        </div>

        {/* LEFT SIDE: TRANSACTIONS */}
        <div className="lg:col-span-8 space-y-6 lg:order-2 order-1">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Ledger Activity History
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                Total: {transactions ? transactions.length : 0} records
              </span>
            </div>
            <div className="p-0">
              {transactions && transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                    <thead className="bg-slate-50/70 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">From Account</th>
                        <th className="px-6 py-3.5">To Account</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5">Description</th>
                        <th className="px-6 py-3.5">Type</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-slate-50">
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
                            {transaction.description}
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

                          <td className="px-6 py-4 text-right">
                            {new Date(transaction.createdAt).toLocaleString()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
