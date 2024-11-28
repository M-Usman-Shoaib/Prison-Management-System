import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../src/Components/Home.css";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is missing and navigate to /login
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]); // Ensure the effect runs when the token changes

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="overlay">
          <div className="content">
            <h1 className="headline">Prison Management System</h1>
            <p className="subtitle">
              Streamlining Correctional Facility Operations with Efficiency and Innovation
            </p>
            <Link to="/dashboard" className="cta-link">
              <button className="cta-button">Go to Dashboard</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
