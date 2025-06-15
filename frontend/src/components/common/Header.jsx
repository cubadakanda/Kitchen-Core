import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Kitchen Core</h1>
        </div>
        <nav className="nav">
          <ul>
            <li>Home</li>
            <li>Recipes</li>
            <li>Categories</li>
          </ul>
        </nav>
        <div className="user-actions">
          {user ? (
            <div>
              <span>Welcome, {user.name}</span>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <button>Login</button>
              <button>Register</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
