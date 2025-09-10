import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation(); // track current attempted route

  // show loading while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // not logged in means we redirect to login
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // role mismatch means we redirect to login
  if (role && user.role !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;
