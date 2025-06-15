import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import FavoritesList from '../../components/user/FavoritesList';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [userStats, setUserStats] = useState({
    totalFavorites: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user favorites and stats
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.id !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="profile-page">
          <div className="not-logged-in">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your profile.</p>
            <button onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <div className="profile-page">
        <div className="profile-header">
          <div className="user-info">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <p className="user-role">Role: {user.role}</p>
            </div>
          </div>
          
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{userStats.totalFavorites}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userStats.totalRatings}</span>
              <span className="stat-label">Ratings Given</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'favorites' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('favorites')}
          >
            My Favorites
          </button>
          <button 
            className={activeTab === 'settings' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              {loading ? (
                <div className="loading">Loading favorites...</div>
              ) : (
                <FavoritesList 
                  favorites={favorites}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-section">
                <h2>Account Settings</h2>
                
                <div className="setting-item">
                  <label>Name</label>
                  <input type="text" value={user.name} readOnly />
                </div>
                
                <div className="setting-item">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                
                <div className="setting-actions">
                  <button className="btn-secondary">Change Password</button>
                  <button className="btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
