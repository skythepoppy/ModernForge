import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import usePreviousRoute from "../hooks/usePreviousRoute"; // adjust path if needed

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const prevLocation = usePreviousRoute();

  // --- Auth check: redirect if already logged in ---
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
      const res = await axios.post("http://localhost:5050/api/auth/login", formData);

      login(res.data.user, res.data.token);

      setMessage("Login successful!");
      console.log("Logged in user:", res.data);

      handleRedirect(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  // 🔑 Helper: decides where to send the user
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
