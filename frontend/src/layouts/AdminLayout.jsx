import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar />
      <main className="admin-main" style={{ flex: 1, marginLeft: '256px', transition: 'margin-left 0.3s ease' }}>
        <div style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '16px 24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>Kitchen Core Admin</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Manage your recipe platform</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
