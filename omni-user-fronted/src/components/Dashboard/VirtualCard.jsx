import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCheck, FiCopy, FiCreditCard, FiEye, FiEyeOff } from "react-icons/fi";

const VirtualCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/account-detail",
        {
          withCredentials: true,
        },
      );

      setAccount(response.data);
    } catch (error) {
      console.error("Failed to fetch account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAccount = async () => {
    if (!account) return;

    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy account number:", err);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-6 border border-slate-100 h-60 flex items-center justify-center">
        Loading...
      </section>
    );
  }

  if (!account) {
    return (
      <section className="bg-white rounded-2xl p-6 border border-slate-100 h-60 flex items-center justify-center">
        Failed to load account.
      </section>
    );
  }

  const maskedAccount = "**** **** " + account.accountNumber.slice(-4);

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden h-60">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
            {account.status} Account
          </span>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-mono text-slate-300">
              {maskedAccount}
            </span>

            <button
              onClick={handleCopyAccount}
              className="text-slate-400 hover:text-white transition"
            >
              {copied ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>

            {copied && (
              <span className="text-xs text-emerald-400">Copied!</span>
            )}
          </div>
        </div>

        <FiCreditCard className="w-7 h-7 text-blue-400" />
      </div>

      <div className="z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Total Balance</span>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="hover:text-white"
          >
            {showBalance ? (
              <FiEyeOff className="w-3.5 h-3.5" />
            ) : (
              <FiEye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="text-3xl font-bold">
          {showBalance
            ? `Rs ${Number(account.balance).toLocaleString()}`
            : "••••••••"}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 z-10">
        <span className="font-semibold">
          Issued At <br />
          {new Date(account.createdAt).toLocaleDateString()}
        </span>

        <span className="font-semibold text-slate-200 tracking-wider">
          VIRTUAL ACCOUNT
        </span>
      </div>
    </section>
  );
};

export default VirtualCard;
