import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="header-background">
        <div className="food-orbit orbit-1"></div>
        <div className="food-orbit orbit-2"></div>
        <div className="food-orbit orbit-3"></div>
        <div className="food-orbit orbit-4"></div>
      </div>
      <div className="container header-content">
        <h1 className="header-title">Deliver the Delicious</h1>
        <p className="header-subtitle">Your favorite meals, brought to you with speed and style.</p>
        <Link to="/explore" className="explore-link">Explore</Link>
      </div>
    </header>
  );
};

export default Header;