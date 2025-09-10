import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function AdminPage() {
    const { user, token, logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Redirect if not authenticated or not admin
    if (!user || !token) {
        navigate("/login", { replace: true });
        return null;
    }

    if (user.role !== "admin") {
        navigate("/login", { replace: true });
        return null;
    }

    const handleLogout = () => {
        logout();
        setMessage("Successfully logged out!");

        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1500);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome, {user.name}!</p>

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

            {/* Render logout message */}
            {message && (
                <p className="mt-4 text-green-500 font-medium">{message}</p>
            )}

            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Log Out
            </button>
        </div>
    );
}
