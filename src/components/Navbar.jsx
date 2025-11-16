import React from "react";
import { Link } from "react-router-dom";
import "../components/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Marksheet Analyzer</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/manual">Manual Entry</Link>
      </div>
    </nav>
  );
};

export default Navbar;
