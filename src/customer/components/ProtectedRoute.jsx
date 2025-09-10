import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation(); // track current attempted route

  // Not logged in → redirect to login
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role mismatch → redirect to login
  if (role && user.role !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
