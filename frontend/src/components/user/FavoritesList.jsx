import React from 'react';

const FavoritesList = ({ favorites, onRemoveFavorite }) => {
  return (
    <div className="favorites-list">
      <h2>My Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(recipe => (
            <div key={recipe.id} className="favorite-item">
              <img src={recipe.image || '/default-recipe.jpg'} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <button onClick={() => onRemoveFavorite(recipe.id)}>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
