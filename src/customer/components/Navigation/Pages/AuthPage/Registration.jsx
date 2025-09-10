import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import usePreviousRoute from "../hooks/usePreviousRoute"; // adjust path as needed

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const { user, token, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const prevLocation = usePreviousRoute();

    // --- Redirect if already logged in ---
    useEffect(() => {
        if (user && token) {
            handleRedirect(user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5050/api/auth/register",
                formData
            );

            // auto-login using AuthContext
            login(res.data.user, res.data.token);

            setMessage("Registration successful!");
            console.log("Registered user:", res.data);

            // Redirect after registration
            handleRedirect(res.data.user);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
        }
    };

    // 🔑 Helper: decide redirect location
    const handleRedirect = (user) => {
        if (
            prevLocation &&
            prevLocation.pathname !== "/login" &&
            prevLocation.pathname !== "/register"
        ) {
            navigate(prevLocation.pathname, { replace: true });
        } else if (user.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/user/dashboard", { replace: true });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
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
