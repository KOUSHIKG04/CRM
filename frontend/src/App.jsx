import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TelecallerPage from "./pages/TelecallerPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute role="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/telecaller"
              element={
                <PrivateRoute role="telecaller">
                  <TelecallerPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Login />} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
