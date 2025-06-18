import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import SharePopup from '../../components/common/SharePopup';
import useRecipes from '../../hooks/useRecipes';
import { fetchCategories } from '../../services/categoryService';
import '../../styles/bulma-home.css';

const Recipes = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchRecipes } = useRecipes();  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Prevent flickering on initial load
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shareMessage, setShareMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'newest',
    difficulty: ''
  });

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
  };  useEffect(() => {
    const loadData = async () => {
      try {
        if (initialLoad) setLoading(true);
        
        // Load recipes
        const recipesData = await fetchRecipes();
        setRecipes(recipesData);
        
        // Load categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        setLoading(false);
        setInitialLoad(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - hanya load sekali saat component mount
  // Use useMemo to optimize filtering and prevent unnecessary re-computations
  const filteredRecipes = useMemo(() => {
    // Filter and sort recipes
    let filtered = [...recipes];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(recipe => 
        recipe.category && recipe.category.name === filters.category
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '2024-01-01') - new Date(a.created_at || '2024-01-01'));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || '2024-01-01') - new Date(b.created_at || '2024-01-01'));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'time':
        filtered.sort((a, b) => (a.cooking_time || 0) - (b.cooking_time || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [recipes, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  const handleFavorite = async (recipeId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      // Add favorite functionality here
      console.log('Adding to favorites:', recipeId);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  // Optimized search with debouncing
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm
      }));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="home-page">
        <Header user={user} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <div className="loader is-loading"></div>
              <p className="mt-4">Loading recipes...</p>
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
        recipe={selectedRecipe}
        isOpen={showSharePopup}
        onClose={closeSharePopup}
        onShareComplete={handleShareComplete}
      />

      {/* Hero Section */}
      <section className="hero is-small" style={{
        background: `linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)`,
        color: 'var(--text-on-primary)'
      }}>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column">
                <h1 className="title is-2 has-text-white">
                  <i className="fas fa-utensils mr-3"></i>
                  All Recipes
                </h1>
                <p className="subtitle is-5 has-text-white-ter">
                  Discover amazing recipes from around the world
                </p>
              </div>
              <div className="column is-narrow">
                <div className="field has-addons">
                  <div className="control has-icons-left is-expanded">                    <input 
                      className="input is-medium" 
                      type="text" 
                      placeholder="Search recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="icon is-left">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="section py-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="columns is-mobile is-multiline">
            <div className="column is-narrow">
              <div className="field">
                <label className="label is-small">Category</label>
                <div className="control">
                  <div className="select is-small">
                    <select 
                      value={filters.category} 
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-narrow">
              <div className="field">
                <label className="label is-small">Sort By</label>
                <div className="control">
                  <div className="select is-small">
                    <select 
                      value={filters.sortBy} 
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="time">Cooking Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label is-small">Results</label>
                <p className="is-size-7 has-text-grey">
                  Showing {filteredRecipes.length} of {recipes.length} recipes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="section">
        <div className="container">
          {filteredRecipes.length === 0 ? (
            <div className="has-text-centered py-6">
              <i className="fas fa-search fa-3x has-text-grey-light mb-4"></i>
              <h3 className="title is-4 has-text-grey">No recipes found</h3>
              <p className="has-text-grey">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="columns is-multiline">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="column is-4-desktop is-6-tablet is-12-mobile">
                  <div className="card">
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <img 
                          src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'} 
                          alt={recipe.title}
                          style={{ objectFit: 'cover' }}
                        />
                      </figure>
                      <div className="recipe-time-badge">
                        <span className="tag is-warning is-light">
                          <i className="fas fa-clock mr-1"></i>
                          {recipe.cooking_time || 30} min
                        </span>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="media">
                        <div className="media-content">
                          <p className="title is-5">{recipe.title}</p>
                          <p className="subtitle is-6 has-text-grey">
                            {recipe.category ? recipe.category.name : 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                      <div className="content">
                        <p className="is-size-7 has-text-grey-dark">
                          {recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}
                        </p>
                        <div className="level is-mobile mt-3">
                          <div className="level-left">
                            <div className="level-item">
                              <span className="tag is-light">
                                <i className="fas fa-fire mr-1"></i>
                                {recipe.calories || 0} cal
                              </span>
                            </div>
                          </div>
                          <div className="level-right">
                            <div className="level-item">
                              <div className="field is-grouped">
                                <div className="control">
                                  <button 
                                    className="button is-small is-white"
                                    onClick={() => handleFavorite(recipe.id)}
                                    title="Add to favorites"
                                  >
                                    <i className="far fa-heart"></i>
                                  </button>
                                </div>
                                <div className="control">
                                  <button 
                                    className="button is-small is-white"
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
                      <footer className="card-footer">
                        <Link 
                          to={`/recipes/${recipe.id}`} 
                          className="card-footer-item button is-primary is-fullwidth"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          View Recipe
                        </Link>
                      </footer>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Load More Section */}
      {filteredRecipes.length > 0 && (
        <section className="section has-background-light">
          <div className="container has-text-centered">
            <button className="button is-primary is-medium">
              <i className="fas fa-plus mr-2"></i>
              Load More Recipes
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Recipes;
