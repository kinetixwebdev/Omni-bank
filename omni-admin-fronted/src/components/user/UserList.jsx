import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PendingUser = ({ selectedStatus = "Active" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, [selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/user/${selectedStatus}`,
        {
          withCredentials: true,
        },
      );

      setUsers(response.data.filter((user) => user.role !== "ADMIN"));
    } catch (err) {
      toast.error("Failed to Load User");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-b-xl border border-gray-200 overflow-hidden">
      <ToastContainer />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <th className="p-4">Holder Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">CNIC Number</th>
              <th className="p-4">Status</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created At</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 cursor-pointer select-none"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <td className="p-4 font-semibold">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phoneNumber}</td>
                  <td className="p-4">{user.cnicNumber}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4">{user.role}</td>

                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingUser;
