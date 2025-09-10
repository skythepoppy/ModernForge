import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import api from "../../../api/api";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const { user, token, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // track previous route

    // If already logged in, redirect to dashboard or previous route
    useEffect(() => {
        if (user && token) handleRedirect(user);
    }, [user, token]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", formData); // centralized Axios
            login(res.data.user, res.data.token); // update AuthContext + Axios

            setMessage("Login successful!");
            console.log("Logged in user:", res.data);

            handleRedirect(res.data.user);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
        }
    };

    // 🔑 Helper: redirect user after login
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
        <div className="flex justify-center items-start pt-8 pb-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6">Login</h2>

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
                    className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>

                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
