import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserPage() {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const token = sessionStorage.getItem("token");

        if (!token || !storedUser) {
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


