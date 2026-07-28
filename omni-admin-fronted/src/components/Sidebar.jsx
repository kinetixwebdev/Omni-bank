import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HiMiniBanknotes } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { LuLayoutDashboard, LuUser } from "react-icons/lu"; // Example navigation icons
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountBalance } from "react-icons/md";
import { SiStarlingbank } from "react-icons/si";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoMdHelpCircleOutline } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Example navigation links — add yours here
  const navLinks = [
    { name: "Dashboard", path: "/", icon: LuLayoutDashboard },
    { name: "Users", path: "/user", icon: LuUser },
    { name: "Accounts", path: "/accounts", icon: MdOutlineAccountBalance },
    { name: "Setting", path: "/setting", icon: IoSettingsOutline },
    { name: "Help Center", path: "/help-center", icon: IoMdHelpCircleOutline },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/auth/logout", {
        withCredentials: true,
      });
      // Clear any local storage/state if needed here
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="shrink-0 w-60 border-r h-screen border-slate-100 bg-white flex flex-col justify-between">
      {/* Top Section: Logo & Main Nav */}
      <div className="flex flex-col w-full">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 p-5  border-black/5">
          <SiStarlingbank className="text-3xl text-green-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Omni Bank
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className=" mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-green-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="text-xl" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <div className=" border-t border-black/5">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-6 cursor-pointer rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Log out of your account"
        >
          <IoIosLogOut className="text-xl shrink-0" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
