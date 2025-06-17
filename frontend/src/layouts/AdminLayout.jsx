import React, { useState, useContext } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar collapsed={sidebarCollapsed} />
        <main className={`admin-content ${sidebarCollapsed ? 'is-expanded' : ''}`}>
        {/* Top Header */}
        <div className="admin-header" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="level is-mobile" style={{ width: '100%', margin: 0 }}>
            <div className="level-left">
              <button className="button is-small mr-2" onClick={toggleSidebar} 
                style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', border: 'none' }}>
                <span className="icon">
                  <i className={`fas fa-${sidebarCollapsed ? 'expand' : 'compress'}`}></i>
                </span>
              </button>
              <div className="ml-2">
                <h1 className="title is-4 has-text-weight-bold mb-0 primary-color">Kitchen Core Admin</h1>
                <p className="is-size-7 has-text-grey">Manage your recipe platform</p>
              </div>
            </div>
            <div className="level-right">
              <div className="has-text-grey is-size-7 mr-4">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
                {/* Admin Profile Section */}
              <div className="admin-profile-section">
                <div className="dropdown is-right is-hoverable">
                  <div className="dropdown-trigger">
                    <button className="button is-rounded profile-button" 
                      aria-haspopup="true" 
                      aria-controls="dropdown-menu"
                      style={{ 
                        backgroundColor: 'var(--secondary-color)', 
                        color: 'var(--primary-color)', 
                        border: '1px solid var(--primary-color)',
                        fontWeight: 'bold'
                      }}>
                      <span className="icon is-small mr-2">
                        <i className="fas fa-user-circle"></i>
                      </span>
                      <span>{user?.name || 'Admin'}</span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <Link to="/admin/profile" className="dropdown-item">
                        <span className="icon is-small mr-2">
                          <i className="fas fa-user"></i>
                        </span>
                        Profile
                      </Link>
                      <Link to="/admin/settings" className="dropdown-item">
                        <span className="icon is-small mr-2">
                          <i className="fas fa-cog"></i>
                        </span>
                        Settings
                      </Link>
                      <hr className="dropdown-divider" />
                      <a onClick={logout} className="dropdown-item">
                        <span className="icon is-small mr-2">
                          <i className="fas fa-sign-out-alt"></i>
                        </span>
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-5">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
