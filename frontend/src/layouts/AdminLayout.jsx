import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar collapsed={sidebarCollapsed} />
      
      <main className={`admin-content ${sidebarCollapsed ? 'is-expanded' : ''}`}>
        {/* Top Header */}
        <div className="admin-header">
          <div className="level is-mobile" style={{ width: '100%' }}>
            <div className="level-left">
              <button className="button is-small" onClick={toggleSidebar}>
                <span className="icon">
                  <i className={`fas fa-${sidebarCollapsed ? 'expand' : 'compress'}`}></i>
                </span>
              </button>
              <div className="ml-4">
                <h1 className="title is-4 has-text-weight-bold has-text-primary mb-0">Kitchen Core Admin</h1>
                <p className="is-size-7 has-text-grey">Manage your recipe platform</p>
              </div>
            </div>
            <div className="level-right">
              <div className="has-text-grey is-size-7">
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
        
        {/* Main Content */}
        <div className="p-5">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
