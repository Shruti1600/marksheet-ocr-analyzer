import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import ManualEntryPage from "./pages/ManualEntryPage.jsx";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/manual" element={<ManualEntryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
