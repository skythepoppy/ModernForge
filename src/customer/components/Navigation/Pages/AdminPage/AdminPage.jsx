import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPage() {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const token = sessionStorage.getItem("token");

        if (!token || !storedUser || storedUser.role !== "admin") {
            navigate("/login");
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setMessage("Successfully logged out!");

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    if (!user) return null;

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

            {/* Render logout message here */}
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


