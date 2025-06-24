import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/header.css';

const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/auth');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header">
      <div className="header-container">        <Link to="/home" className="brand">
          <i className="fas fa-utensils brand-icon"></i>
          <span className="brand-name">Kitchen Core</span>
        </Link>        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><Link to="/home" className="active">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            {user && <li><Link to="/my-recipes">My Recipes</Link></li>}
          </ul>
        </nav>
        
        <div className="user-menu">
          <button className="toggle-menu" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
          
          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
                <span className="hidden md:inline">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="logout-btn">
              <i className="fas fa-user"></i>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
