import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/user/RecipeCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recipes from API
    setLoading(false);
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Kitchen Core</h1>
        <p>Discover amazing recipes and share your favorites!</p>
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
