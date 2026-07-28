import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      await fetchUser();
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-neutral-50 px-4">
      <ToastContainer autoClose={1000} position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="border border-black/10 bg-white flex flex-col p-6 sm:p-8 sm:py-16 rounded-2xl w-full max-w-md shadow-sm"
      >
        <h2 className="font-bold text-2xl text-center text-neutral-800 tracking-tight">
          Login Admin Panel 👋
        </h2>
        <p className="text-neutral-500 text-sm mb-4 text-center mt-3">
          Welcome back! Please enter your details.
        </p>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className="border border-black/10 p-3 rounded-xl outline-none focus:border-black/40 transition-colors placeholder:text-neutral-400"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 mt-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="border border-black/10 p-3 rounded-xl outline-none focus:border-black/40 transition-colors placeholder:text-neutral-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 flex items-center justify-center hover:bg-blue-500 text-white font-medium w-full p-3 mt-6 cursor-pointer transition-colors rounded-xl shadow-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border border-white rounded-full animate-spin"></div>
          ) : (
            "Signin"
          )}
        </button>
      </form>
    </div>
  );
};

export default Signin;
