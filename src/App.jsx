import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DriverHome from "./pages/DriverHome";
import RiderHome from "./pages/RiderHome";
import Preferences from "./pages/Preferences";
import Booking from "./pages/Booking";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ paddingTop: "80px", paddingBottom: "10px" }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/riderHome" element={<RiderHome />} />
            <Route path="/driverHome" element={<DriverHome />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/ride/book/:id" element={<Booking />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
