import React, { useState, useEffect } from 'react';
import { getSafeImageUrl, getFullImageUrl } from '../../utils/imageUtils';
import { getAverageRating } from '../../services/ratingService';

const RecipeCard = ({ recipe, onView, onFavorite, isFavorited }) => {
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [loadingRating, setLoadingRating] = useState(true);

  // Load average rating when component mounts
  useEffect(() => {
    const loadRating = async () => {
      try {
        if (recipe && recipe.id) {
          const ratingData = await getAverageRating(recipe.id);
          setAverageRating(ratingData);
        }
      } catch (error) {
        console.error('Error loading rating for recipe:', recipe?.id, error);
        setAverageRating({ average: 0, count: 0 });
      } finally {
        setLoadingRating(false);
      }
    };

    loadRating();
  }, [recipe?.id]);

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
      />      <div className="recipe-card-content">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        
        {/* Rating Display */}
        <div className="recipe-rating">
          {loadingRating ? (
            <span className="rating-loading">Loading rating...</span>
          ) : averageRating.count > 0 ? (
            <div className="rating-display">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star ${
                      star <= Math.round(averageRating.average) ? 'star-filled' : 'star-empty'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="rating-text">
                {averageRating.average} ({averageRating.count} review{averageRating.count !== 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <div className="rating-display">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="fas fa-star star-empty"></i>
                ))}
              </div>
              <span className="rating-text">No reviews yet</span>
            </div>
          )}
        </div>
        
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
