import React from 'react';

const RecipeCard = ({ recipe, onView, onFavorite, isFavorited }) => {
  return (
    <div className="recipe-card">
      <img 
        src={recipe.image_url ? 
          (recipe.image_url.startsWith('http') ? 
            recipe.image_url : 
            recipe.image_url.startsWith('/') ? 
              recipe.image_url : 
              `/${recipe.image_url}`
          ) : 
          '/default-recipe.jpg'
        }
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
