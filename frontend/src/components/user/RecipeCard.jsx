import React from 'react';
import { getSafeImageUrl, getFullImageUrl } from '../../utils/imageUtils';

const RecipeCard = ({ recipe, onView, onFavorite, isFavorited }) => {
  // Helper function to get the correct image URL
  const getRecipeImageUrl = (recipe) => {
    if (!recipe || !recipe.image_url) {
      return '/default-recipe.jpg';
    }
    
    // If it's already a full URL (like Unsplash), use it as is
    if (recipe.image_url.startsWith('http://') || recipe.image_url.startsWith('https://')) {
      return recipe.image_url;
    }
    
    // If it's our uploaded image path, convert to full URL
    if (recipe.image_url.startsWith('/uploads/')) {
      return `http://localhost:5000${recipe.image_url}`;
    }
    
    // If it starts with uploads/ (without leading slash)
    if (recipe.image_url.startsWith('uploads/')) {
      return `http://localhost:5000/${recipe.image_url}`;
    }
    
    // Fallback
    return getSafeImageUrl(recipe.image_url);
  };

  return (
    <div className="recipe-card">
      <img 
        src={getRecipeImageUrl(recipe)}
        alt={recipe.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/default-recipe.jpg';
        }}
      />
      <div className="recipe-card-content">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <div className="recipe-card-actions">
          <button onClick={() => onView(recipe.id)}>View Recipe</button>
          <button 
            onClick={() => onFavorite(recipe.id)}
            className={isFavorited ? 'favorited' : ''}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
