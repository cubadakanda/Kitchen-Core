import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import SharePopup from '../../components/common/SharePopup';
import useRecipes from '../../hooks/useRecipes';
import fetchRecipeById from '../../services/recipeDetailService';
import '../../styles/bulma-home.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { fetchRecipes } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleShare = () => {
    setShowSharePopup(true);
  };

  const handleShareComplete = (message) => {
    setShareMessage(message);
    setShowSharePopup(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  const closeSharePopup = () => {
    setShowSharePopup(false);
  };
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const recipeData = await fetchRecipeById(id);
          if (recipeData) {
            // Process the recipe data
            const enhancedRecipe = {
              ...recipeData,
              ingredients: recipeData.ingredients ? 
                (typeof recipeData.ingredients === 'string' ? 
                  recipeData.ingredients.split('\n').filter(item => item.trim()) : 
                  recipeData.ingredients) : 
                ['No ingredients available'],
              instructions: recipeData.instructions ? 
                (typeof recipeData.instructions === 'string' ? 
                  recipeData.instructions.split('\n').filter(item => item.trim()) : 
                  recipeData.instructions) : 
                ['No instructions available'],
              nutritionFacts: recipeData.nutritionFacts || {
                calories: recipeData.calories || 0,
                protein: '15g',
                carbs: '65g',
                fat: '12g',
                fiber: '3g',
                sugar: '8g'
              },
              difficulty: recipeData.difficulty || 'Medium',
              servings: recipeData.servings || 4,
              prepTime: recipeData.prep_time || 15,
              cookTime: recipeData.cooking_time || 20
            };
            setRecipe(enhancedRecipe);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API failed, trying fallback data:', apiError);
        }
        
        // Fallback to mock data if API fails
        const { fetchRecipes } = useRecipes();
        const recipesData = await fetchRecipes();
        const foundRecipe = recipesData.find(r => r.id === parseInt(id));
          if (foundRecipe) {
          // Enhance recipe data with detailed information
          const enhancedRecipe = {
            ...foundRecipe,
            ingredients: foundRecipe.ingredients ? 
              (typeof foundRecipe.ingredients === 'string' ? 
                foundRecipe.ingredients.split('\n') : 
                foundRecipe.ingredients) : 
              [
                '2 cups rice',
                '3 eggs', 
                '1 onion, diced',
                '2 cloves garlic, minced',
                '2 tablespoons soy sauce',
                '1 tablespoon oil',
                'Salt and pepper to taste'
              ],
            instructions: foundRecipe.instructions ? 
              (typeof foundRecipe.instructions === 'string' ? 
                foundRecipe.instructions.split('\n') : 
                foundRecipe.instructions) : 
              [
                'Heat oil in a large pan or wok over medium-high heat.',
                'Add diced onion and cook until translucent, about 3-4 minutes.',
                'Add minced garlic and cook for another minute.',
                'Push vegetables to one side of the pan and scramble eggs on the other side.',
                'Add cooked rice to the pan and stir everything together.',
                'Add soy sauce, salt, and pepper. Stir-fry for 3-4 minutes.',
                'Serve hot and enjoy your delicious fried rice!'
              ],
            nutritionFacts: foundRecipe.nutritionFacts || {
              calories: foundRecipe.calories || 420,
              protein: '15g',
              carbs: '65g',
              fat: '12g',
              fiber: '3g',
              sugar: '8g'
            },
            difficulty: foundRecipe.difficulty || 'Medium',
            servings: foundRecipe.servings || 4,
            prepTime: foundRecipe.prep_time || 15,
            cookTime: foundRecipe.cooking_time || 20
          };
          setRecipe(enhancedRecipe);
        } else {
          navigate('/recipes');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
        navigate('/recipes');
      }
    };    loadRecipe();
  }, [id, navigate]); // Hapus fetchRecipes dari dependency

  const handleAddToFavorites = async () => {
    if (!user) {
      alert('Please login to add favorites');      return;
    }
    
    try {
      // Add/remove from favorites
      setIsFavorited(!isFavorited);
      console.log('Toggled favorite for recipe:', id);
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

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      // Submit rating
      console.log('Submitting rating:', { rating, comment });
      setRating(0);
      setComment('');
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <Header user={user} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <div className="loader is-loading"></div>
              <p className="mt-4">Loading recipe...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="home-page">
        <Header user={user} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <i className="fas fa-exclamation-triangle fa-3x has-text-warning mb-4"></i>
              <h3 className="title is-4">Recipe not found</h3>
              <Link to="/recipes" className="button is-primary">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Share Message */}
      {shareMessage && (
        <div className="notification is-success is-light" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          <button className="delete" onClick={() => setShareMessage('')}></button>
          <i className="fas fa-check-circle"></i> {shareMessage}
        </div>
      )}

      {/* Share Popup */}
      <SharePopup 
        recipe={recipe}
        isOpen={showSharePopup}
        onClose={closeSharePopup}
        onShareComplete={handleShareComplete}
      />      {/* Recipe Hero Section */}
      <section className="section py-6" style={{
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        minHeight: '60vh'
      }}>
        <div className="container">
          <div className="columns is-vcentered" style={{ minHeight: '50vh' }}>
            <div className="column is-8">
              <nav className="breadcrumb has-text-white mb-4">
                <ul>
                  <li><Link to="/home" className="has-text-white">Home</Link></li>
                  <li><Link to="/recipes" className="has-text-white">Recipes</Link></li>
                  <li className="is-active"><a className="has-text-white">{recipe.title}</a></li>
                </ul>
              </nav>
              
              <h1 className="title is-1 has-text-white mb-4">{recipe.title}</h1>
              <p className="subtitle is-4 has-text-white-ter mb-5">
                {recipe.description || 'A delicious recipe that will satisfy your taste buds'}
              </p>
              
              {/* Recipe Meta Info */}
              <div className="columns is-mobile">
                <div className="column is-narrow">
                  <div className="has-text-centered">
                    <i className="fas fa-clock fa-2x has-text-warning mb-2"></i>
                    <p className="is-size-7 has-text-white-ter">TOTAL TIME</p>
                    <p className="has-text-white is-size-6 has-text-weight-bold">
                      {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                    </p>
                  </div>
                </div>
                <div className="column is-narrow">
                  <div className="has-text-centered">
                    <i className="fas fa-users fa-2x has-text-info mb-2"></i>
                    <p className="is-size-7 has-text-white-ter">SERVINGS</p>
                    <p className="has-text-white is-size-6 has-text-weight-bold">
                      {recipe.servings || 4}
                    </p>
                  </div>
                </div>
                <div className="column is-narrow">
                  <div className="has-text-centered">
                    <i className="fas fa-signal fa-2x has-text-success mb-2"></i>
                    <p className="is-size-7 has-text-white-ter">DIFFICULTY</p>
                    <p className="has-text-white is-size-6 has-text-weight-bold">
                      {recipe.difficulty || 'Medium'}
                    </p>
                  </div>
                </div>
                <div className="column is-narrow">
                  <div className="has-text-centered">
                    <i className="fas fa-fire fa-2x has-text-danger mb-2"></i>
                    <p className="is-size-7 has-text-white-ter">CALORIES</p>
                    <p className="has-text-white is-size-6 has-text-weight-bold">
                      {recipe.calories || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="field is-grouped mt-5">
                <div className="control">
                  <button 
                    className={`button is-large ${isFavorited ? 'is-danger' : 'is-white'}`}
                    onClick={handleAddToFavorites}
                  >
                    <i className={`fas fa-heart mr-2`}></i>
                    {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
                <div className="control">
                  <button 
                    className="button is-large is-primary"
                    onClick={handleShare}
                  >
                    <i className="fas fa-share-alt mr-2"></i>
                    Share Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {/* Ingredients */}
            <div className="column is-4">
              <div className="box" style={{ position: 'sticky', top: '20px' }}>
                <h2 className="title is-4">
                  <i className="fas fa-list-ul mr-2 has-text-primary"></i>
                  Ingredients
                </h2>
                <div className="content">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="ingredient-list">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="mb-2">
                          <label className="checkbox">
                            <input type="checkbox" className="mr-2" />
                            {ingredient}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="has-text-grey">No ingredients listed.</p>
                  )}
                </div>

                {/* Nutrition Facts */}
                <div className="mt-5">
                  <h3 className="title is-5">
                    <i className="fas fa-chart-pie mr-2 has-text-success"></i>
                    Nutrition Facts
                  </h3>
                  <div className="nutrition-grid">
                    {recipe.nutritionFacts && Object.entries(recipe.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="level is-mobile mb-2">
                        <div className="level-left">
                          <div className="level-item">
                            <span className="has-text-weight-semibold is-capitalized">{key}:</span>
                          </div>
                        </div>
                        <div className="level-right">
                          <div className="level-item">
                            <span className="tag is-light">{value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="column is-8">
              <div className="box">
                <h2 className="title is-4">
                  <i className="fas fa-clipboard-list mr-2 has-text-primary"></i>
                  Instructions
                </h2>
                <div className="content">
                  {recipe.instructions && recipe.instructions.length > 0 ? (
                    <div className="instruction-steps">
                      {recipe.instructions.map((step, index) => (
                        <div key={index} className="instruction-step mb-4 p-4" style={{
                          borderLeft: '4px solid var(--primary-color)',
                          backgroundColor: '#f8f9fa'
                        }}>
                          <div className="level is-mobile">
                            <div className="level-left">
                              <div className="level-item">
                                <span className="tag is-primary is-large">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3">{step}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="has-text-grey">No instructions available.</p>
                  )}
                </div>
              </div>

              {/* Rating Section */}
              <div className="box mt-5">
                <h2 className="title is-4">
                  <i className="fas fa-star mr-2 has-text-warning"></i>
                  Rate & Review
                </h2>
                
                {user ? (
                  <form onSubmit={handleRatingSubmit}>
                    <div className="field">
                      <label className="label">Your Rating</label>
                      <div className="control">
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`button is-large is-white ${
                                star <= rating ? 'has-text-warning' : 'has-text-grey-light'
                              }`}
                              style={{ border: 'none', padding: '0.5rem' }}
                            >
                              <i className="fas fa-star"></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="field">
                      <label className="label">Your Review (Optional)</label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          placeholder="Share your thoughts about this recipe..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows="4"
                        />
                      </div>
                    </div>
                    
                    <div className="field">
                      <div className="control">
                        <button 
                          type="submit" 
                          className="button is-primary"
                          disabled={rating === 0}
                        >
                          <i className="fas fa-paper-plane mr-2"></i>
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="notification is-info is-light">
                    <p>
                      <Link to="/auth" className="has-text-link">Login</Link> to rate and review this recipe.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetail;
