import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  
  // Redirect if not admin
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
