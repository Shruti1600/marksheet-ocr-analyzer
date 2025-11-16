import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Marksheet Analyzer</h1>
      <p>Upload your marksheet or enter marks manually to calculate percentage.</p>
      <div className="button-group">
        <Link to="/upload"><button>Upload Marksheet</button></Link>
        <Link to="/manual"><button>Manual Entry</button></Link>
      </div>
    </div>
  );
};

export default Home;
