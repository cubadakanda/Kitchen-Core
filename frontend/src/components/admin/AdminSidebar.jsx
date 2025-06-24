import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  const toggleSubmenu = (index) => {
    setExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
    },    {
      icon: "tags",
      label: 'Categories',
      path: '/admin/categories'
    },
    {
      icon: "star",
      label: 'Ratings',
      path: '/admin/ratings'
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
    },
    {
      icon: "chart-bar",
      label: 'Analytics',
      path: '/admin/analytics'
    },
    {
      icon: "cog",
      label: 'Settings',
      path: '/admin/settings'
    }
  ];

  // Function to check if a menu item or its subitems are active
  const isActive = (item) => {
    if (location.pathname === item.path) return true;
    
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.path);
    }
    
    return false;
  };

  return (
    <div className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''}`} style={{ 
      width: collapsed ? '70px' : '250px',
      backgroundColor: 'var(--primary-color)'
    }}>
      {/* Sidebar Header/Brand */}
      <div className="sidebar-brand" style={{ 
        padding: collapsed ? '1rem 0' : '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="sidebar-logo" style={{ 
          fontSize: '1.5rem',
          color: 'var(--secondary-color)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <i className="fas fa-utensils mr-2"></i>
          {!collapsed && <span>Kitchen Core</span>}
        </div>
      </div>
      
      {/* Sidebar Menu Items */}
      <div className="sidebar-menu" style={{ flex: '1' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* Main menu item */}
              <div 
                className={`sidebar-menu-item ${isActive(item) ? 'is-active' : ''}`}
                onClick={() => item.subItems ? toggleSubmenu(index) : navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  color: isActive(item) ? 'var(--secondary-color)' : 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  borderLeft: isActive(item) ? '4px solid var(--secondary-color)' : '4px solid transparent',
                  backgroundColor: isActive(item) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="icon" style={{ marginRight: collapsed ? '0' : '0.75rem' }}>
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.subItems && (
                      <span className="icon is-small">
                        <i className={`fas fa-angle-${expandedMenus[index] ? 'down' : 'right'}`}></i>
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {/* Submenu items */}
              {!collapsed && item.subItems && expandedMenus[index] && (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0 0 0 2.5rem',
                  margin: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.path}
                        style={{
                          display: 'block',
                          padding: '0.5rem 1rem',
                          color: location.pathname === subItem.path 
                            ? 'var(--secondary-color)' 
                            : 'rgba(255, 255, 255, 0.7)',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Sidebar Footer */}
      <div className="sidebar-footer" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem',
        textAlign: collapsed ? 'center' : 'left'
      }}>
        <button 
          onClick={handleLogout} 
          className="button is-small is-outlined"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--secondary-color)',
            color: 'var(--secondary-color)',
            width: collapsed ? '100%' : 'auto'
          }}
        >
          <span className="icon">
            <i className="fas fa-sign-out-alt"></i>
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
