import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { getAuthHeader } from "../middleware/auth";
import axios from "axios";

export default function UserPage() {
    const { user, token, logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState(null); // example API data
    const navigate = useNavigate();

    if (!user || !token) {
        navigate("/login", { replace: true });
        return null;
    }

    if (user.role !== "user") {
        navigate("/login", { replace: true });
        return null;
    }

    useEffect(() => {
        // Example: fetch user-specific data from backend
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5050/api/user/data",
                    getAuthHeader(token)
                );
                setUserData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [token]);

    const handleLogout = () => {
        logout();
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

            {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}

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
