import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
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
                const res = await api.get("/users/profile"); // centralized Axios handles token
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

    const [openIndex, setOpenIndex] = useState(null);
    const toggleSection = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!user) return null; // Auth loading or not logged in


    return (
        <div className="flex justify-center items-start min-h-screen pt-16">
            <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md w-full">
                {/* Centered Icon */}
                <div className="flex justify-center mb-6">
                    <UserIcon className="text-orange-500 w-12 h-12" />
                </div>

                {/* Centered Content */}
                <h1 className="text-3xl mb-4">Welcome, <span className="font-bold">{user.name}</span></h1>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>

                {message && (
                    <p className="mt-4 text-green-500 font-medium">{message}</p>
                )}

                <div className="space-y-4 mt-6">
                    {/* Order History */}
                    <div className="border rounded-lg shadow-md">
                        <button
                            className="w-full text-left font-semibold px-4 py-3 flex justify-between items-center"
                            onClick={() => toggleSection(0)}
                        >
                            <span>Order History</span>
                            <span>{openIndex === 0 ? "−" : "+"}</span>
                        </button>
                        {openIndex === 0 && (
                            <div className="px-4 pb-4 text-gray-700">
                                <ul className="list-disc list-inside">
                                    <li>Order #1234 – Delivered – $59.99</li>
                                    <li>Order #5678 – Processing – $24.50</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Saved Addresses */}
                    <div className="border rounded-lg shadow-md">
                        <button
                            className="w-full text-left font-semibold px-4 py-3 flex justify-between items-center"
                            onClick={() => toggleSection(1)}
                        >
                            <span>Saved Addresses</span>
                            <span>{openIndex === 1 ? "−" : "+"}</span>
                        </button>
                        {openIndex === 1 && (
                            <div className="px-4 pb-4 text-gray-700">
                                <p>123 Main St, Hurst, TX 76053</p>
                                <p>456 Oak Ave, Dallas, TX 75201</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    Log Out
                </button>
            </div>
        </div>



    );
}
