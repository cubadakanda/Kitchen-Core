import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = ({ children, user, onLogout }) => {
  return (
    <div className="main-layout">
      <Header user={user} onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
