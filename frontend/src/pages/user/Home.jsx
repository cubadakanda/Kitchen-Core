import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/user/RecipeCard';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    // Fetch recipes from API
    setLoading(false);
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-header">
          <div className="hero-text">
            <h1>Welcome to Kitchen Core</h1>
            <p>Discover amazing recipes and share your favorites!</p>
            {user && <p className="welcome-user">Hello, {user.name}!</p>}
          </div>
          <div className="hero-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="featured-recipes">
        <h2>Featured Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={(id) => console.log('View recipe:', id)}
                onFavorite={(id) => console.log('Favorite recipe:', id)}
                isFavorited={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
