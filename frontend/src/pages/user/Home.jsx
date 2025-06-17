import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/user/RecipeCard';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import '../../styles/home.css';
import useRecipes from '../../hooks/useRecipes';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchRecipes } = useRecipes();
  const [categories, setCategories] = useState([
    { id: 1, name: 'All Recipes', icon: 'utensils', count: '3,240+' },
    { id: 2, name: 'Meat', icon: 'drumstick-bite', count: '1,120+' },
    { id: 3, name: 'Vegetarian', icon: 'leaf', count: '890+' },
    { id: 4, name: 'Seafood', icon: 'fish', count: '450+' },
    { id: 5, name: 'Desserts', icon: 'ice-cream', count: '760+' },
    { id: 6, name: 'Smoothies', icon: 'blender', count: '320+' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        // Get only the first 3-6 recipes for the featured section
        setRecipes(data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    loadRecipes();
  }, [fetchRecipes]);
  return (
    <div className="home-page">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h1>Discover & Share Amazing Recipes</h1>
            <p>Join our community of food lovers and explore thousands of delicious recipes from around the world.</p>
            {user && <p className="welcome-user">Hello, {user.name}!</p>}
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for recipes, ingredients, or chefs..." 
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="popular-searches">
            <span>Popular Searches:</span>
            <a href="#" className="search-tag">Pasta</a>
            <a href="#" className="search-tag">Chicken</a>
            <a href="#" className="search-tag">Dessert</a>
            <a href="#" className="search-tag">Vegetarian</a>
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="featured-recipes">
        <div className="section-header">
          <h2>Featured Recipes</h2>
          <Link to="/recipes" className="view-all">View All <i className="fas fa-arrow-right"></i></Link>
        </div>
        
        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <div className="recipes-grid">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-image-container">
                    <img 
                      src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'} 
                      alt={recipe.title} 
                      className="recipe-image" 
                    />
                    <div className="recipe-time">
                      <i className="fas fa-clock"></i> {recipe.cooking_time || '30'} mins
                    </div>
                  </div>
                  <div className="recipe-content">
                    <div className="recipe-header">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <div className="recipe-rating">
                        <i className="fas fa-star"></i>
                        <span className="recipe-rating-value">4.5</span>
                      </div>
                    </div>
                    <p className="recipe-description">
                      {recipe.description || 'A delicious recipe that you will love to try at home.'}
                    </p>
                    <div className="recipe-meta">
                      <div className="recipe-tags">
                        <span className="recipe-tag">
                          <i className="fas fa-utensils"></i> {recipe.category_name || 'Main Dish'}
                        </span>
                        <span className="recipe-tag">
                          <i className="fas fa-fire"></i> {recipe.calories || '400'} cal
                        </span>
                      </div>
                      <button className="favorite-button">
                        <i className="far fa-bookmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recipes found. Be the first to add a recipe!</p>
            )}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-header">
          <h2>Browse by Category</h2>
        </div>
        
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={`/recipes?category=${category.id}`} key={category.id} className="category-item">
              <div className="category-icon">
                <i className={`fas fa-${category.icon}`}></i>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-count">{category.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-header">
            <h2>Join Our Culinary Community</h2>
          </div>
          <p className="newsletter-text">
            Subscribe to our newsletter and get weekly recipes, cooking tips, and exclusive content straight to your inbox.
          </p>
          
          <div className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Your email address" />
            <button className="newsletter-button">Subscribe</button>
          </div>
          
          <p className="newsletter-privacy">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
