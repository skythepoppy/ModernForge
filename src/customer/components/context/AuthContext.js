import React, { createContext, useReducer, useEffect } from "react";
import { setToken } from "../api/api"; // centralized Axios instance

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true, // helps while checking localStorage
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return { user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app load, check localStorage for user/token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // Sync token with Axios instance
      setToken(token);

      dispatch({
        type: "LOGIN",
        payload: { token, user: JSON.parse(user) },
      });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Sync token with Axios instance
    setToken(token);

    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear token from Axios instance
    setToken(null);

    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
