import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import useRecipes from '../../hooks/useRecipes';
import '../../styles/bulma-home.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchRecipes } = useRecipes();
  const [favorites, setFavorites] = useState([]);
  const [userStats, setUserStats] = useState({
    totalFavorites: 0,
    totalRatings: 0,
    memberSince: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    favoritesCuisine: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || user.username || 'User',
        email: user.email || 'user@example.com',
        bio: user.bio || 'Food enthusiast and cooking lover',
        location: user.location || 'Kitchen, Worldwide',
        favoritesCuisine: user.favoritesCuisine || 'International'
      });
      fetchUserData();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Simulate fetching user favorites (mock data for now)
      const allRecipes = await fetchRecipes();
      const mockFavorites = allRecipes.slice(0, 3); // Get first 3 recipes as favorites
      
      setFavorites(mockFavorites);
      setUserStats({
        totalFavorites: mockFavorites.length,
        totalRatings: 5, // Mock data
        memberSince: 2024
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      setFavorites(favorites.filter(fav => fav.id !== recipeId));
      setUserStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - 1
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Save profile changes
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="home-page">
        <Header user={null} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <i className="fas fa-user-slash fa-3x has-text-grey-light mb-4"></i>
              <h3 className="title is-4">Please Login</h3>
              <p className="has-text-grey mb-4">You need to be logged in to view your profile.</p>
              <Link to="/auth" className="button is-primary">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="home-page">
        <Header user={user} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <div className="loader is-loading"></div>
              <p className="mt-4">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="home-page">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Simplified Profile Section */}
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">
              <div className="card">
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-64x64">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&size=64&background=432818&color=ffffff`}
                          alt="Profile"
                          className="is-rounded"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{userInfo.name}</p>
                      <p className="subtitle is-6">{userInfo.email}</p>
                      <p className="content">{userInfo.bio}</p>
                    </div>
                    <div className="media-right">
                      <button 
                        className="button is-primary is-outlined"
                        onClick={() => setEditMode(!editMode)}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        {editMode ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                  </div>
                  
                  {editMode && (
                    <div className="box mt-4">
                      <form onSubmit={handleSaveProfile}>
                        <div className="field">
                          <label className="label">Name</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="text" 
                              value={userInfo.name}
                              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label">Email</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="email" 
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label">Bio</label>
                          <div className="control">
                            <textarea 
                              className="textarea" 
                              rows="3"
                              value={userInfo.bio}
                              onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="field is-grouped">
                          <div className="control">
                            <button type="submit" className="button is-primary">
                              Save Changes
                            </button>
                          </div>
                          <div className="control">
                            <button 
                              type="button" 
                              className="button is-light"
                              onClick={() => setEditMode(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Stats */}
      <section className="section py-4">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">
              <div className="columns is-mobile has-text-centered">
                <div className="column">
                  <div className="box">
                    <i className="fas fa-heart fa-2x has-text-danger mb-2"></i>
                    <p className="title is-4">{userStats.totalFavorites}</p>
                    <p className="subtitle is-6">Favorites</p>
                  </div>
                </div>
                <div className="column">
                  <div className="box">
                    <i className="fas fa-star fa-2x has-text-warning mb-2"></i>
                    <p className="title is-4">{userStats.totalRatings}</p>
                    <p className="subtitle is-6">Reviews</p>
                  </div>
                </div>
                <div className="column">
                  <div className="box">
                    <i className="fas fa-calendar fa-2x has-text-info mb-2"></i>
                    <p className="title is-4">{userStats.memberSince}</p>
                    <p className="subtitle is-6">Member Since</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Favorite Recipes */}
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">
              <h2 className="title is-4">
                <i className="fas fa-heart mr-2 has-text-danger"></i>
                Favorite Recipes
              </h2>
              
              {favorites.length === 0 ? (
                <div className="box has-text-centered">
                  <i className="fas fa-heart fa-3x has-text-grey-light mb-4"></i>
                  <h3 className="title is-5 has-text-grey">No favorites yet</h3>
                  <p className="has-text-grey">Start exploring recipes to add them to your favorites!</p>
                  <Link to="/recipes" className="button is-primary mt-4">
                    Browse Recipes
                  </Link>
                </div>
              ) : (
                <div className="columns is-multiline">
                  {favorites.map(recipe => (
                    <div key={recipe.id} className="column is-6">
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-16by9">
                            <img 
                              src={recipe.image_url || 'https://bulma.io/images/placeholders/480x320.png'}
                              alt={recipe.title}
                              style={{ objectFit: 'cover' }}
                            />
                          </figure>
                        </div>
                        <div className="card-content">
                          <p className="title is-6">{recipe.title}</p>
                          <p className="content is-size-7">{recipe.description?.substring(0, 80)}...</p>
                          <div className="field is-grouped">
                            <div className="control">
                              <Link 
                                to={`/recipes/${recipe.id}`}
                                className="button is-primary is-small"
                              >
                                View
                              </Link>
                            </div>
                            <div className="control">
                              <button 
                                className="button is-danger is-small is-outlined"
                                onClick={() => handleRemoveFavorite(recipe.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>    </div>
  );
};

export default Profile;
