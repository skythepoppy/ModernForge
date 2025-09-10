import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import api from "../../../api/api";

export default function AdminPage() {
  const { user, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [adminData, setAdminData] = useState(null); // example API data
  const navigate = useNavigate();

  // Fetch admin-specific data from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/users/all"); // centralized Axios handles token
        setAdminData(res.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/login", { replace: true });
        }
      }
    };

    fetchAdminData();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    setMessage("Successfully logged out!");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  if (!user) return null; // Auth loading or not logged in

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      {adminData && (
        <div className="mt-4">
          {/* Render any admin-specific data here */}
          <pre>{JSON.stringify(adminData, null, 2)}</pre>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Sales Data
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Affiliate Submissions
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Wholesale Submissions
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Support Submissions
        </button>
      </div>

      {message && <p className="mt-4 text-green-500 font-medium">{message}</p>}

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
