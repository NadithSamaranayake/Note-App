import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "./components/routing/PrivateRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Context
import { AuthProvider } from "./context/AuthContext";
import { NoteProvider } from "./context/NoteContext";

function App() {
  return (
    <AuthProvider>
      <NoteProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </Router>
      </NoteProvider>
    </AuthProvider>
  );
}

export default App;
