import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import api from "../../../api/api";

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const { user, token, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // track previous route

    // If already logged in, redirect
    useEffect(() => {
        if (user && token) handleRedirect(user);
    }, [user, token]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", formData); // centralized API call
            const { user: newUser, token } = res.data;

            console.log("Full response:", res);

            login(newUser, token); // auto-login
            setMessage("Registration successful!");
            console.log("Registered user:", newUser);

            handleRedirect(newUser);
            
        } catch (err) {
            console.error("Registration error:", err); // error checking 
            setMessage(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Error occurred"
            );
        }

    };

    const handleRedirect = (user) => {
        const from = location.state?.from?.pathname; // comes from ProtectedRoute
        if (from && from !== "/login" && from !== "/register") {
            navigate(from, { replace: true });
        } else if (user.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/user/dashboard", { replace: true });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6">Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>

                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
