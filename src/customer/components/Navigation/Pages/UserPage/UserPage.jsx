import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function UserPage() {
    const { user, token, logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Redirect if not authenticated or wrong role
    if (!user || !token) {
        navigate("/login", { replace: true });
        return null;
    }

    if (user.role !== "user") {
        navigate("/login", { replace: true });
        return null;
    }

    const handleLogout = () => {
        logout(); // centralized logout
        setMessage("Successfully logged out!");

        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1500);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            {/* Render logout message */}
            {message && (
                <p className="mt-4 text-green-500 font-medium">{message}</p>
            )}

            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Log Out
            </button>
        </div>
    );
}
