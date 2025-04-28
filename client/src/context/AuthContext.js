import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set axios auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me");
      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: err.response.data.msg,
      });
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: err.response.data.msg,
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: "LOGOUT" });

  // Clear errors
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  // Load user on initial render
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
