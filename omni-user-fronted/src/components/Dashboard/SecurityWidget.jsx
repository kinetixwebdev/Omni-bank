import React from "react";
import { FiShield } from "react-icons/fi";

const SecurityWidget = () => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200  p-6 space-y-3">
      <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
        <FiShield className="w-4 h-4 text-blue-600" />
        <span>2FA Protection Active</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Your account is currently protected with Two-Factor Authentication via
        Mobile Authenticator.
      </p>
    </section>
  );
};

export default SecurityWidget;
