import React from 'react';

const RecipeCard = ({ recipe, onView, onFavorite, isFavorited }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image || '/default-recipe.jpg'} alt={recipe.title} />
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
