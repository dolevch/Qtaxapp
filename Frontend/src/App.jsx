import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Signup from "./components/Signup";
import AdminPortal from "./components/AdminPortal";
import APITestComponent from "./components/APITestComponent"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/test" element={<APITestComponent />} />{" "}
        {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;
