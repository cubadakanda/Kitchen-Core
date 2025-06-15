import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Recipes</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Total Categories</h3>
          <p>0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
