import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../src/Components/Home.css';
import Prisons from '../src/Components/Prisons.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const navigationHandlers = {
    handlePrisons: () => navigate('/prisons'),
    handleCells: () => navigate('/cells'),
    handleCrimes: () => navigate('/crimes'),
    handleInmates: () => navigate('/inmates'),
    handleVisitors: () => navigate('/visitors'),
  };

  return (
    <div className="dashboard-container">
      {/* <Prisons /> */}
      <header className="dashboard-header">
        <h1>Prison Management System</h1>
        <p>Streamlining Correctional Facility Operations with Efficiency and Innovation</p>
      </header>

      <div className="dashboard-actions2">
        <button onClick={navigationHandlers.handlePrisons} className="action-button2">
          Prison Management
        </button>
        <button onClick={navigationHandlers.handleCells} className="action-button2">
          Cell Management
        </button>
        <button onClick={navigationHandlers.handleCrimes} className="action-button2">
          Crime Management
        </button>
        <button onClick={navigationHandlers.handleInmates} className="action-button2">
          Inmate Management
        </button>
        <button onClick={navigationHandlers.handleVisitors} className="action-button2">
          Visitor Management
        </button>
      </div>
    </div> 
  );
};

export default Dashboard;
