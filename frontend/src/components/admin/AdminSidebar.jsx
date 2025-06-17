import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  // Enhanced menu items with submenu support
  const menuItems = [
    {
      icon: "tachometer-alt",
      label: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      icon: "utensils",
      label: 'Recipes',
      path: '/admin/recipes',
      subItems: [
        { 
          label: 'All Recipes',
          path: '/admin/recipes'
        },
        { 
          label: 'Add Recipe',
          path: '/admin/recipes/add'
        }
      ]
    },
    {
      icon: "tags",
      label: 'Categories',
      path: '/admin/categories'
    },
    {
      icon: "users",
      label: 'Users',
      path: '/admin/users',
      subItems: [
        { 
          label: 'All Users',
          path: '/admin/users'
        },
        { 
          label: 'Add User',
          path: '/admin/users/add'
        }
      ]
    }
  ];
  const isActive = (path) => {
    // Exact matching for main paths, partial matching for subpaths
    if (path === '/admin/recipes' || path === '/admin/users') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      {/* Brand Logo and Name */}
      <div className="p-4 has-text-centered">
        {!collapsed && (
          <h2 className="title is-5 has-text-white mb-2">Kitchen Core</h2>
        )}
        <figure className="image is-48x48 mx-auto">
          <img 
            src="/logo.svg" 
            alt="Kitchen Core Logo" 
            className="is-rounded" 
            style={{ background: 'white', padding: '5px', transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => {e.currentTarget.style.transform = 'scale(1.1)'}}
            onMouseOut={(e) => {e.currentTarget.style.transform = 'scale(1)'}}
          />
        </figure>
      </div>
      
      {/* Navigation Menu */}
      <aside className="menu p-4">
        <p className="menu-label has-text-light">Main Menu</p>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.subItems ? (
                <div>
                  <Link 
                    to={item.path}
                    className={isActive(item.path) ? 'is-active' : ''}
                  >
                    <span className="icon">
                      <i className={`fas fa-${item.icon}`}></i>
                    </span>
                    {!collapsed && (
                      <>
                        <span className="mr-2">{item.label}</span>
                        <span className="icon is-small">
                          <i className="fas fa-chevron-down" aria-hidden="true"></i>
                        </span>
                      </>
                    )}
                  </Link>
                  
                  {!collapsed && item.subItems && (
                    <ul>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link 
                            to={subItem.path}
                            className={location.pathname === subItem.path ? 'is-active' : ''}
                          >
                            <span className="icon is-small">
                              <i className="fas fa-circle fa-xs"></i>
                            </span>
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'is-active' : ''}
                >
                  <span className="icon">
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
        
        {!collapsed && (
          <>
            <p className="menu-label has-text-light mt-6">Account</p>
            <ul className="menu-list">
              <li>
                <a onClick={handleLogout} className="has-text-danger-light">
                  <span className="icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </>
        )}
      </aside>
      
      {/* Collapsed View Logout */}
      {collapsed && (
        <div className="has-text-centered mt-6">
          <button 
            onClick={handleLogout} 
            className="button is-small is-danger is-outlined is-rounded"
            title="Logout"
          >
            <span className="icon">
              <i className="fas fa-sign-out-alt"></i>
            </span>
          </button>
        </div>
      )}
        {/* User Info at Bottom */}
      {!collapsed && user && (
        <div className="user-profile p-4 mt-auto border-t border-gray-700">
          <div className="media">
            <div className="media-left">
              <figure className="image is-40x40">
                <img 
                  src={user.avatar || 'https://bulma.io/images/placeholders/128x128.png'} 
                  alt={user.name} 
                  className="is-rounded admin-avatar"
                />
              </figure>
            </div>
            <div className="media-content">
              <p className="has-text-white is-size-6 has-text-weight-semibold">{user.name}</p>
              <div className="is-flex is-align-items-center">
                <span className="admin-badge"></span>
                <p className="has-text-grey-lighter is-size-7 ml-1">Admin</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
