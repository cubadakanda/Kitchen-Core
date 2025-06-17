import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      label: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      label: 'Manage Recipes',
      path: '/admin/recipes'
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      label: 'Manage Categories',
      path: '/admin/categories'
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: 'Manage Users',
      path: '/admin/users'
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: 'Recipe Ratings',
      path: '/admin/ratings'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: isCollapsed ? '64px' : '256px',
    height: '100vh',
    background: 'linear-gradient(to bottom, #1f2937, #111827)',
    color: 'white',
    transition: 'width 0.3s ease',
    boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '-12px',
    top: '24px',
    backgroundColor: 'white',
    color: '#6b7280',
    borderRadius: '50%',
    padding: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 1001
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const logoStyle = {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #f97316, #dc2626)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const userInfoStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: isCollapsed ? 'none' : 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const userAvatarStyle = {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const navStyle = {
    flex: 1,
    padding: '24px 16px',
    overflowY: 'auto'
  };

  const menuItemStyle = (active) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '8px',
    border: 'none',
    background: active 
      ? 'linear-gradient(135deg, #f97316, #dc2626)' 
      : 'transparent',
    color: active ? 'white' : '#d1d5db',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left'
  });

  const footerStyle = {
    padding: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <aside style={sidebarStyle}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={toggleButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f9fafb';
          e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
      >
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ 
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        {!isCollapsed && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Kitchen Core</h2>
            <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0 }}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* User Info */}
      <div style={userInfoStyle}>
        <div style={userAvatarStyle}>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: '500', fontSize: '14px', margin: 0 }}>{user?.name || 'Admin'}</p>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{user?.email || 'admin@kitchen.com'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => navigate(item.path)}
                style={menuItemStyle(isActive(item.path))}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#d1d5db';
                  }
                }}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={footerStyle}>
        <button 
          onClick={handleLogout}
          style={{
            ...menuItemStyle(false),
            marginBottom: 0
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#d1d5db';
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
