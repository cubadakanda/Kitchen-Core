import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Kitchen Core</h2>
        <p>Admin Panel</p>
      </div>
      <nav>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/recipes">Manage Recipes</a></li>
          <li><a href="/admin/categories">Manage Categories</a></li>
          <li><a href="/admin/users">Manage Users</a></li>
          <li><a href="/admin/ratings">Recipe Ratings</a></li>
        </ul>
      </nav>      <div className="admin-sidebar-footer">
        <button 
          className="logout-btn" 
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
