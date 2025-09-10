import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import api from "../../../api/api";

export default function UserPage() {
    const { user, logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState(null); // example API data
    const navigate = useNavigate();

    // Fetch user-specific data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/user/data"); // centralized Axios handles token
                setUserData(res.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    logout();
                    navigate("/login", { replace: true });
                }
            }
        };

        fetchData();
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
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            {userData && (
                <div className="mt-4">
                    {/* Render any user-specific data here */}
                    <pre>{JSON.stringify(userData, null, 2)}</pre>
                </div>
            )}

            {message && <p className="mt-4 text-green-500 font-medium">{message}</p>}

            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Log Out
            </button>
        </div>
    );
}
