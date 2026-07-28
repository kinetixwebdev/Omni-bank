import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const SendMoneyPage = () => {
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isFetchingName, setIsFetchingName] = useState(false);

  const [formData, setFormData] = useState({
    toAccount: "",
    amount: "",
    description: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  useEffect(() => {
    fetchRecentRecipients();
  }, []);

  const fetchRecentRecipients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/transaction/recent/recipients",
        { withCredentials: true },
      );
      setRecentRecipients(response.data || []);
    } catch (error) {
      console.error("Failed to fetch recent recipients", error);
    }
  };

  const fetchAccountHolderName = async (accountNumber) => {
    if (!accountNumber || accountNumber.trim().length < 8) {
      setAccountHolderName("");
      return;
    }

    setIsFetchingName(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/account/name/${accountNumber}`,
        { withCredentials: true },
      );

      // Extract string name directly or from object key (e.g. response.data.name or response.data)
      const name =
        typeof response.data === "string" ? response.data : response.data?.name;
      setAccountHolderName(name || "Account Found");
    } catch (error) {
      setAccountHolderName("");
    } finally {
      setIsFetchingName(false);
    }
  };

  // Debounced API call: Trigger name lookup after user stops typing for 500ms
  useEffect(() => {
    const account = formData.toAccount.trim();

    // First check if it already matches a recent recipient to show instant feedback
    const matchedRecent = recentRecipients.find(
      (r) => r.accountNumber === account,
    );
    if (matchedRecent) {
      setAccountHolderName(matchedRecent.name);
      return;
    }

    if (account.length >= 8) {
      const timer = setTimeout(() => {
        fetchAccountHolderName(account);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAccountHolderName("");
    }
  }, [formData.toAccount, recentRecipients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecentClick = (recipient) => {
    setFormData((prev) => ({
      ...prev,
      toAccount: recipient.accountNumber,
    }));
    setAccountHolderName(recipient.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false });

    const payload = {
      toAccount: formData.toAccount,
      amount: parseFloat(formData.amount),
      description: formData.description,
    };

    try {
      await axios.post("http://localhost:8080/api/v1/user/transfer", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setStatus({ loading: false, success: true });
      setFormData({ toAccount: "", amount: "", description: "" });
      setAccountHolderName("");
      fetchRecentRecipients();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network exception. Check your server connection.");
      }
      setStatus({ loading: false, success: false });
    }
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans antialiased ">
      <ToastContainer autoClose={2000} hideProgressBar={true} />
      <div className="mb-8 p-5 mt-4 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Transfer Money
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Send funds instantly and securely to external or internal
              accounts.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Instant Transfers Active
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* LEFT SIDE: Send Money Form */}
        <section className="bg-white p-6 lg:p-10 rounded-2xl border border-slate-100 ">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                Recipient Account Number
              </label>
              <input
                type="text"
                name="toAccount"
                placeholder="Enter account number / IBAN"
                value={formData.toAccount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base outline-none  transition-all"
              />
              {/* Account Holder Fetch Feedback Label */}
              {isFetchingName && (
                <span className="text-xs text-amber-600 font-medium animate-pulse">
                  Searching account holder...
                </span>
              )}
              {!isFetchingName && accountHolderName && (
                <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  ✓ {accountHolderName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                Amount to Send
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-base font-medium text-gray-400">
                  Rs
                </span>
                <input
                  type="number"
                  name="amount"
                  step="1"
                  min="1"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-base font-medium outline-none  transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Add an internal reference tag or notes..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none  transition-all min-h-[100px] resize-y font-sans"
              />
            </div>

            {/* Subtle disclaimer */}
            <div className="bg-slate-50 p-4 rounded-lg text-xs text-gray-400 leading-normal border border-slate-100">
              Processing Schedule: Standard transfers complete immediately. No
              extra service fees apply.
            </div>
          </form>
        </section>

        {/* RIGHT SIDE: Summary Panel & Actions */}
        <aside className="flex flex-col gap-6">
          {/* Recipient Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100  flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
              Recipient Summary
            </h3>

            <div className="flex flex-col gap-3 text-sm pb-5 border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-gray-400">Account Number:</span>
                <span className="font-medium text-gray-900 truncate max-w-[180px]">
                  {formData.toAccount || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Holder Name:</span>
                <span className="font-medium text-emerald-700 truncate max-w-[180px]">
                  {isFetchingName ? "Fetching..." : accountHolderName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Type:</span>
                <span className="font-medium text-gray-900">TRANSFER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network Fee:</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total to Send
              </span>
              <span className="text-base font-bold text-gray-900">
                Rs {formData.amount || "0.00"}
              </span>
            </div>

            {/* Main CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={
                status.loading || !formData.toAccount || !formData.amount
              }
              className="w-full bg-green-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-lg text-sm transition-all disabled:bg-slate-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {status.loading ? (
                "Processing Wire..."
              ) : (
                <>
                  <span>✓</span> Confirm and Send
                </>
              )}
            </button>
          </div>

          {/* Recent Recipients Quick Selection Row */}
          {recentRecipients.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 ">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
                Recent Recipients
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {recentRecipients.map((recipient, index) => {
                  const initial = recipient.name
                    ? recipient.name.charAt(0).toUpperCase()
                    : "?";

                  return (
                    <button
                      key={`${recipient.accountNumber}-${index}`}
                      type="button"
                      onClick={() => handleRecentClick(recipient)}
                      className="flex flex-col items-center gap-1.5 p-1 group border border-transparent hover:border-slate-100 rounded-xl transition-all"
                    >
                      <div className="w-11 h-11 rounded-full bg-blue-100 text-emerald-800 flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105">
                        {initial}
                      </div>
                      <span className="text-xs text-gray-500 font-medium truncate w-full text-center group-hover:text-gray-900">
                        {recipient.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Success Modal */}
      {status.success && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-xs z-50">
          <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full mx-4 shadow-xl border border-slate-100">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full text-xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Transfer Dispatched
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Your money transfer was completed successfully.
            </p>
            <button
              onClick={() => setStatus({ ...status, success: false })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-6 rounded-xl text-sm font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMoneyPage;
