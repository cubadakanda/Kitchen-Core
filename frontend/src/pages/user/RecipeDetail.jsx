import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchRecipe();
    fetchRatings();
    checkIfFavorited();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      // Fetch recipe from API
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      // Fetch ratings from API
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const checkIfFavorited = async () => {
    if (user) {
      // Check if recipe is in user's favorites
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    
    try {
      // Add/remove from favorites
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to rate recipes');
      return;
    }

    try {
      // Submit rating
      setRating(0);
      setComment('');
      fetchRatings(); // Refresh ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="loading">Loading recipe...</div>
      </MainLayout>
    );
  }

  if (!recipe) {
    return (
      <MainLayout user={user}>
        <div className="not-found">Recipe not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="recipe-detail">
        <div className="recipe-header">
          <img 
            src={recipe.image || '/default-recipe.jpg'} 
            alt={recipe.title}
            className="recipe-image"
          />
          <div className="recipe-info">
            <h1>{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>
            
            <div className="recipe-meta">
              <span>⏱️ {recipe.cooking_time} minutes</span>
              <span>📊 {recipe.difficulty}</span>
              <span>📁 {recipe.category_name}</span>
            </div>
            
            <div className="recipe-actions">
              <button 
                onClick={handleAddToFavorites}
                className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              >
                {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients?.split('\n').map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions">
              {recipe.instructions?.split('\n').map((step, index) => (
                <div key={index} className="instruction-step">
                  <span className="step-number">{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ratings-section">
          <h2>Ratings & Reviews</h2>
          
          {user && (
            <div className="rating-form">
              <h3>Rate this Recipe</h3>
              <form onSubmit={handleRatingSubmit}>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={star <= rating ? 'star active' : 'star'}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                
                <textarea
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                />
                
                <button type="submit" disabled={rating === 0}>
                  Submit Rating
                </button>
              </form>
            </div>
          )}

          <div className="ratings-list">
            {ratings.map((ratingItem) => (
              <div key={ratingItem.id} className="rating-item">
                <div className="rating-header">
                  <span className="user-name">{ratingItem.user_name}</span>
                  <div className="stars">
                    {'⭐'.repeat(ratingItem.rating)}
                  </div>
                </div>
                {ratingItem.comment && (
                  <p className="rating-comment">{ratingItem.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RecipeDetail;
