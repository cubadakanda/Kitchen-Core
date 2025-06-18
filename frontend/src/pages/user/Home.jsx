import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import SharePopup from '../../components/common/SharePopup';
import LazyImage from '../../components/common/LazyImage';
import '../../styles/bulma-home.css';
import useRecipes from '../../hooks/useRecipes';
import { fetchCategories } from '../../services/categoryService';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchRecipes } = useRecipes();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleShare = (recipe) => {
    setSelectedRecipe(recipe);
    setShowSharePopup(true);
  };

  const handleShareComplete = (message) => {
    setShareMessage(message);
    setShowSharePopup(false);
    setSelectedRecipe(null);
    
    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  const closeSharePopup = () => {
    setShowSharePopup(false);
    setSelectedRecipe(null);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load recipes
        const recipesData = await fetchRecipes();
        setRecipes(recipesData.slice(0, 6));

        // Load categories from database
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };    loadData();
  }, []); // Empty dependency array - hanya load sekali saat component mount

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
        recipe={selectedRecipe}
        isOpen={showSharePopup}
        onClose={closeSharePopup}
        onShareComplete={handleShareComplete}
      />

      {/* Enhanced Hero Section */}
      <section className="hero is-medium" style={{
        background: `linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)`,
        color: 'var(--text-on-primary)'
      }}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-vcentered">
              <div className="column is-8 is-offset-2">
                <h1 className="title is-1 has-text-white mb-4">
                  <i className="fas fa-utensils mr-3"></i>
                  Kitchen Core
                </h1>
                <h2 className="subtitle is-3 has-text-white mb-5">
                  Discover & Share Amazing Recipes
                </h2>
                <p className="is-size-5 has-text-white mb-6">
                  Join our community of food lovers and explore thousands of delicious recipes from around the world
                </p>
                
                {user && (
                  <div className="notification is-light mb-5" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <p className="has-text-white">
                      <i className="fas fa-user-circle mr-2"></i> 
                      Welcome back, <strong>{user.name}</strong>!
                    </p>
                  </div>
                )}
                
                {/* Enhanced Search Box */}
                <div className="field has-addons has-addons-centered" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div className="control is-expanded">
                    <input 
                      className="input is-large" 
                      type="text" 
                      placeholder="Search for recipes, ingredients, or chefs..."
                      style={{ 
                        fontSize: '1.1rem',
                        padding: '1.5rem 2rem'
                      }}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-large" style={{
                      backgroundColor: 'var(--accent-color)',
                      color: 'var(--text-on-primary)',
                      border: 'none',
                      padding: '1.5rem 2rem'
                    }}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="tags are-medium is-centered mt-5">
                  <span className="tag is-light" style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)' 
                  }}>
                    <i className="fas fa-fire mr-1"></i> Popular:
                  </span>
                  <span className="tag is-light">
                    <i className="fas fa-pepper-hot mr-1"></i> Spicy
                  </span>
                  <span className="tag is-light">
                    <i className="fas fa-drumstick-bite mr-1"></i> Chicken
                  </span>
                  <span className="tag is-light">
                    <i className="fas fa-birthday-cake mr-1"></i> Dessert
                  </span>
                  <span className="tag is-light">
                    <i className="fas fa-leaf mr-1"></i> Vegetarian
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Recipes */}
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="has-text-centered mb-6">
            <h2 className="title is-2" style={{ color: 'var(--primary-color)' }}>
              <i className="fas fa-star mr-3"></i>Featured Recipes
            </h2>
            <p className="subtitle is-5" style={{ color: 'var(--accent-color)' }}>
              Handpicked delicious recipes just for you
            </p>
          </div>
          
          {loading ? (
            <div className="has-text-centered">
              <div className="is-flex is-justify-content-center is-align-items-center" style={{ minHeight: '200px' }}>
                <div>
                  <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-color)' }}></i>
                  <p className="mt-3" style={{ color: 'var(--accent-color)' }}>Loading delicious recipes...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="columns is-multiline">
                {recipes.length > 0 ? (
                  recipes.map(recipe => (
                    <div key={recipe.id} className="column is-one-third">
                      <div className="card">                        <div className="card-image">
                          <figure className="image is-16by9">
                            <LazyImage 
                              src={recipe.image_url} 
                              alt={recipe.title}
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              fallbackSrc="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            />
                          </figure>
                          <div className="recipe-time-badge">
                            <span className="tag" style={{ 
                              backgroundColor: 'var(--primary-color)', 
                              color: 'var(--text-on-primary)'
                            }}>
                              <i className="fas fa-clock mr-1"></i> {recipe.cooking_time || recipe.cook_time || recipe.prep_time || '30'} mins
                            </span>
                          </div>
                        </div>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <p className="title is-5" style={{ color: 'var(--primary-color)' }}>
                                {recipe.title}
                              </p>
                              <div className="tags">
                                <span className="tag" style={{ 
                                  backgroundColor: 'var(--secondary-color)', 
                                  color: 'var(--text-on-secondary)' 
                                }}>
                                  <i className="fas fa-star mr-1"></i> 4.5
                                </span>
                                <span className="tag is-light">
                                  <i className="fas fa-eye mr-1"></i> 234 views
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="content">
                            <p className="is-size-6 mb-4">
                              {recipe.description || 'A delicious recipe that you will love to try at home.'}
                            </p>
                            
                            <div className="level is-mobile">
                              <div className="level-left">
                                <div className="level-item">
                                  <div className="tags are-small">
                                    <span className="tag is-light">
                                      <i className="fas fa-utensils mr-1"></i> 
                                      {recipe.category?.name || 'Main Dish'}
                                    </span>
                                    <span className="tag is-light">
                                      <i className="fas fa-fire mr-1"></i> 
                                      {recipe.calories || '400'} cal
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="level-right">
                                <div className="level-item">
                                  <div className="buttons are-small">
                                    <button className="button is-light" title="Add to favorites">
                                      <i className="far fa-heart"></i>
                                    </button>
                                    <button 
                                      className="button" 
                                      style={{ 
                                        backgroundColor: 'var(--primary-color)', 
                                        color: 'var(--text-on-primary)' 
                                      }}
                                      onClick={() => handleShare(recipe)}
                                      title="Share recipe"
                                    >
                                      <i className="fas fa-share-alt"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="column">
                    <div className="notification is-info is-light has-text-centered">
                      <i className="fas fa-info-circle fa-2x mb-3"></i>
                      <p className="is-size-5 mb-2">No recipes found</p>
                      <p>Be the first to add a delicious recipe to our community!</p>
                    </div>
                  </div>
                )}
              </div>
              
              {recipes.length > 0 && (
                <div className="has-text-centered mt-6">
                  <Link 
                    to="/recipes" 
                    className="button is-large" 
                    style={{ 
                      backgroundColor: 'var(--accent-color)', 
                      color: 'var(--text-on-primary)',
                      borderRadius: '50px',
                      padding: '1rem 2rem'
                    }}
                  >
                    <i className="fas fa-utensils mr-2"></i>
                    Browse All Recipes
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="has-text-centered mb-6">
            <h2 className="title is-2" style={{ color: 'var(--primary-color)' }}>
              <i className="fas fa-th-large mr-3"></i>Browse by Category
            </h2>
            <p className="subtitle is-5" style={{ color: 'var(--accent-color)' }}>
              Explore recipes by your favorite cuisine types
            </p>
          </div>
          
          <div className="columns is-multiline is-centered">
            {categories.length > 0 ? (
              categories.map(category => (
                <div key={category.id} className="column is-one-quarter">
                  <Link to={`/recipes?category=${category.id}`} className="box has-text-centered category-box">
                    <div className="icon is-large" style={{ 
                      backgroundColor: 'var(--secondary-color)', 
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <i className="fas fa-utensils is-size-2" style={{ color: 'var(--primary-color)' }}></i>
                    </div>
                    <h3 className="title is-5" style={{ color: 'var(--primary-color)' }}>
                      {category.name}
                    </h3>
                    <p className="subtitle is-6" style={{ color: 'var(--accent-color)' }}>
                      {category.description || 'Browse recipes'}
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="column">
                <div className="notification is-info is-light has-text-centered">
                  <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
                  <p>Loading categories...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="section newsletter-section" style={{ 
        backgroundColor: 'var(--primary-color)', 
        color: 'var(--text-on-primary)',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}>
        <div className="container has-text-centered">
          <h2 className="title is-2 has-text-white mb-4">
            <i className="fas fa-envelope mr-3"></i>Join Our Culinary Community
          </h2>
          <p className="subtitle is-4 has-text-white mb-6">
            Subscribe to our newsletter and get weekly recipes, cooking tips, and exclusive content straight to your inbox.
          </p>
          
          <div className="field has-addons has-addons-centered" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <div className="control is-expanded">
              <input 
                type="email" 
                className="input is-large" 
                placeholder="Your email address" 
                style={{ borderRadius: '50px 0 0 50px' }}
              />
            </div>
            <div className="control">
              <button className="button is-large" style={{ 
                backgroundColor: 'var(--accent-color)', 
                color: 'var(--text-on-primary)',
                borderRadius: '0 50px 50px 0'
              }}>
                <i className="fas fa-paper-plane mr-2"></i>
                Subscribe
              </button>
            </div>
          </div>
          
          <p className="is-size-6 has-text-white-ter mt-4">
            <i className="fas fa-shield-alt mr-1"></i>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
