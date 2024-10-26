import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Signup from "./components/Signup";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import AdminPortal from "./components/AdminPortal";
import APITestComponent from "./components/APITestComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/page1/:id" element={<Page1 />} />
        <Route path="/page2/:id" element={<Page2 />} />
        <Route path="/page3/:id" element={<Page3 />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/test" element={<APITestComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
