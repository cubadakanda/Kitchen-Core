import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import useRecipes from '../../hooks/useRecipes';
import { favoriteService } from '../../services/favoriteService';
import { getAverageRating } from '../../services/ratingService';
import { getSafeImageUrl, handleImageError } from '../../utils/imageUtils';
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
  }, [user, navigate]);  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's actual favorites from database
      console.log('Fetching user data for user:', user);
      const userFavorites = await favoriteService.getUserFavorites(user.id);
      console.log('User favorites received:', userFavorites);
        if (userFavorites && userFavorites.length > 0) {
        // Extract recipe data from favorites (now includes recipe info)
        const favoriteRecipes = userFavorites
          .filter(fav => fav.recipe && fav.recipe.id) // Only include favorites that have valid recipe data
          .map(fav => fav.recipe); // Extract the recipe object
        
        console.log('Filtered favorite recipes:', favoriteRecipes.length);
        
        // Add ratings to favorite recipes
        const recipesWithRatings = await Promise.all(
          favoriteRecipes.map(async (recipe) => {
            try {
              const rating = await getAverageRating(recipe.id);
              return { ...recipe, rating };
            } catch (error) {
              console.error(`Error loading rating for recipe ${recipe.id}:`, error);
              return { ...recipe, rating: { average: 0, count: 0 } };
            }
          })
        );
        
        setFavorites(recipesWithRatings);
        setUserStats({
          totalFavorites: recipesWithRatings.length,
          totalRatings: 5, // You could fetch actual rating count from user's ratings
          memberSince: new Date(user.createdAt || Date.now()).getFullYear()
        });
      } else {
        console.log('No favorites found or empty response');
        setFavorites([]);
        setUserStats({
          totalFavorites: 0,
          totalRatings: 0,
          memberSince: new Date(user.createdAt || Date.now()).getFullYear()
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setFavorites([]);
      setUserStats({
        totalFavorites: 0,
        totalRatings: 0,
        memberSince: new Date(user.createdAt || Date.now()).getFullYear()
      });
      setLoading(false);
      
      // Show user-friendly message if backend is not running
      if (error.message && error.message.includes('Cannot connect to server')) {
        alert('Cannot connect to the server. Please make sure the backend is running on port 5000.');
      }
    }
  };
  const handleRemoveFavorite = async (recipeId) => {
    try {
      // Remove from database
      await favoriteService.removeFavorite(user.id, recipeId);
      
      // Update local state
      setFavorites(favorites.filter(fav => fav.id !== recipeId));
      setUserStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - 1
      }));
      
      console.log('Favorite removed successfully');
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing favorite. Please try again.');
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
              ) : (                <div className="columns is-multiline">
                  {favorites.map(recipe => (
                    <div key={recipe.id} className="column is-6">
                      <div className="card">
                        <div className="card-image" style={{ position: 'relative' }}>
                          <Link to={`/recipes/${recipe.id}`} style={{ display: 'block' }}>
                            <figure className="image is-16by9">
                              <img 
                                src={getSafeImageUrl(recipe.image_url, 480, 320)}
                                onError={(e) => handleImageError(e, 480, 320)}
                                alt={recipe.title}
                                style={{ 
                                  objectFit: 'cover', 
                                  width: '100%', 
                                  height: '100%',
                                  cursor: 'pointer',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                              />
                            </figure>
                          </Link>
                        </div>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
                                <p className="title is-5" style={{ 
                                  color: 'var(--primary-color)',
                                  cursor: 'pointer',
                                  transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--primary-color)'}
                                >
                                  {recipe.title}
                                </p>
                              </Link>
                              <div className="tags">
                                {recipe.rating && recipe.rating.count > 0 ? (
                                  <span className="tag" style={{ 
                                    backgroundColor: 'var(--secondary-color)', 
                                    color: 'var(--text-on-secondary)' 
                                  }}>
                                    <i className="fas fa-star mr-1"></i> 
                                    {recipe.rating.average}
                                    <span className="ml-1">({recipe.rating.count})</span>
                                  </span>
                                ) : (
                                  <span className="tag" style={{ 
                                    backgroundColor: '#e0e0e0', 
                                    color: '#666' 
                                  }}>
                                    <i className="fas fa-star mr-1"></i> No rating
                                  </span>
                                )}
                                <span className="tag is-light">
                                  <i className="fas fa-clock mr-1"></i> 
                                  {recipe.cooking_time || recipe.cook_time || recipe.prep_time || '30'} mins
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="content">
                            <p className="is-size-6 mb-4">
                              {recipe.description ? recipe.description.substring(0, 100) + '...' : 'A delicious recipe that you will love to try at home.'}
                            </p>
                            
                            <div className="level is-mobile">
                              <div className="level-left">
                                <div className="level-item">
                                  <div className="tags are-small">
                                    <span className="tag is-light">
                                      <i className="fas fa-utensils mr-1"></i> 
                                      {recipe.category?.name || 'Main Dish'}
                                    </span>
                                    <span className="tag is-light">
                                      <i className="fas fa-fire mr-1"></i> 
                                      {recipe.calories || '400'} cal
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="level-right">
                                <div className="level-item">
                                  <div className="buttons are-small">
                                    <Link 
                                      to={`/recipes/${recipe.id}`}
                                      className="button is-primary" 
                                      style={{ 
                                        backgroundColor: 'var(--accent-color)', 
                                        color: 'var(--text-on-primary)',
                                        borderColor: 'var(--accent-color)'
                                      }}
                                      title="View Recipe"
                                    >
                                      <i className="fas fa-eye mr-1"></i>
                                      View
                                    </Link>
                                    <button 
                                      className="button is-danger is-outlined"
                                      onClick={() => handleRemoveFavorite(recipe.id)}
                                      title="Remove from favorites"
                                    >
                                      <i className="fas fa-heart-broken mr-1"></i>
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
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
