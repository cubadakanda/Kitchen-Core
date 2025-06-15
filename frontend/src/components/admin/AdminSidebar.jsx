import React from 'react';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <nav>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/recipes">Manage Recipes</a></li>
          <li><a href="/admin/categories">Manage Categories</a></li>
          <li><a href="/admin/users">Manage Users</a></li>
          <li><a href="/admin/ratings">Recipe Ratings</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
