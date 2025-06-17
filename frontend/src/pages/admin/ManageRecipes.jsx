import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { recipeService } from '../../services/recipeService';

const ManageRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, recipeId: null, recipeName: '' });

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await recipeService.getAllRecipes();
        if (data) {
          setRecipes(data);
          setFilteredRecipes(data);
          
          // Extract unique categories for filter
          const uniqueCategories = [...new Set(data.map(recipe => recipe.category_name))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let result = [...recipes];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter) {
      result = result.filter(recipe => recipe.category_name === categoryFilter);
    }
    
    setFilteredRecipes(result);
  }, [searchTerm, categoryFilter, recipes]);

  // Handle delete recipe
  const handleDeleteRecipe = async () => {
    if (!deleteModal.recipeId) return;
    
    try {
      const response = await recipeService.deleteRecipe(deleteModal.recipeId);
      
      if (response.success) {
        // Update local state after successful deletion
        setRecipes(recipes.filter(recipe => recipe.id !== deleteModal.recipeId));
        setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== deleteModal.recipeId));
        
        // Close modal and show success message
        setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' });
      } else {
        setError(response.message || 'Failed to delete recipe');
      }
    } catch (err) {
      setError('An error occurred while deleting the recipe');
      console.error(err);
    }
  };

  // Handle edit recipe
  const handleEditRecipe = (recipeId) => {
    navigate(`/admin/recipes/edit/${recipeId}`);
  };

  return (
    <AdminLayout>
      <div className="container">
        {/* Header Section */}
        <section className="section is-small pb-0">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title has-text-weight-bold is-2">
                  <span className="icon-text">
                    <span className="icon mr-3 has-text-primary">
                      <i className="fas fa-utensils"></i>
                    </span>
                    <span>Manage Recipes</span>
                  </span>
                </h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Link to="/admin/recipes/add" className="button is-primary is-medium">
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add New Recipe</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="section is-small pt-4">
          <div className="columns">
            <div className="column is-6">
              <div className="field has-addons">
                <div className="control is-expanded has-icons-left">
                  <input
                    className="input"
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
                <div className="control">
                  <button 
                    className="button is-primary"
                    onClick={() => setSearchTerm('')}
                    disabled={!searchTerm}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="field">
                <div className="control has-icons-left">
                  <div className="select is-fullwidth">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="icon is-left">
                    <i className="fas fa-filter"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="column is-3 has-text-right">
              <p className="has-text-grey pt-2">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
              </p>
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="section">
          {isLoading ? (
            <div className="has-text-centered p-6">
              <span className="icon is-large has-text-primary">
                <i className="fas fa-spinner fa-pulse fa-3x"></i>
              </span>
              <p className="mt-4 is-size-5">Loading recipes...</p>
            </div>
          ) : error ? (
            <div className="notification is-danger is-light">
              <p className="has-text-centered">{error}</p>
              <button 
                className="button is-danger mt-3 is-small is-outlined is-fullwidth"
                onClick={() => window.location.reload()}
              >
                <span className="icon">
                  <i className="fas fa-sync-alt"></i>
                </span>
                <span>Try Again</span>
              </button>
            </div>
          ) : (
            filteredRecipes.length === 0 ? (
              <div className="has-text-centered p-6">
                <span className="icon is-large has-text-grey-light">
                  <i className="fas fa-clipboard-list fa-3x"></i>
                </span>
                <p className="mt-4 is-size-5">No recipes found</p>
                {searchTerm || categoryFilter ? (
                  <button 
                    className="button is-small is-primary is-light mt-3"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('');
                    }}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link to="/admin/recipes/add" className="button is-small is-primary is-light mt-3">
                    Add Your First Recipe
                  </Link>
                )}
              </div>
            ) : (
              <div className="columns is-multiline">
                {filteredRecipes.map(recipe => (
                  <div key={recipe.id} className="column is-4">
                    <div className="card admin-card h-100">                      <div className="card-image">                        <figure className="image is-16by9">
                          <img 
                            src={recipe.image_url ? 
                              (recipe.image_url.startsWith('http') ? 
                                recipe.image_url : 
                                recipe.image_url.startsWith('/') ? 
                                  recipe.image_url : 
                                  `/${recipe.image_url}`
                              ) : 
                              "https://bulma.io/images/placeholders/1280x720.png"
                            } 
                            alt={recipe.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              // Fall back to placeholder image for any error
                              e.target.src = "https://bulma.io/images/placeholders/1280x720.png";
                            }}
                          />
                        </figure>
                        <div className="card-image-badge">
                          <span className="tag primary-bg">{recipe.category_name}</span>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="media">
                          <div className="media-content">
                            <p className="title is-5">{recipe.title}</p>                            <p className="subtitle is-6 has-text-grey is-flex is-align-items-center mb-1">
                              <span className="icon is-small mr-1">
                                <i className="fas fa-clock"></i>
                              </span>
                              <span>Cook time: {recipe.cook_time || "n/a"} min</span>
                            </p>
                            <p className="subtitle is-6 has-text-grey is-flex is-align-items-center">
                              <span className="icon is-small mr-1">
                                <i className="fas fa-hourglass-half"></i>
                              </span>
                              <span>Prep time: {recipe.prep_time || "n/a"} min</span>
                            </p>
                          </div>
                        </div>
                        <div className="content">
                          <p className="has-text-grey mb-3">
                            {recipe.description && recipe.description.length > 100 
                              ? `${recipe.description.substring(0, 100)}...` 
                              : recipe.description}
                          </p>                          <div className="is-flex is-justify-content-space-between">
                            <div>
                              <span className="icon-text">
                                <span className="icon">
                                  <i className="fas fa-utensils"></i>
                                </span>
                                <span>{recipe.servings || "N/A"}</span>
                              </span>
                            </div>
                            <div>
                              <span className={`tag ${recipe.status === 'published' ? 'is-success' : 'is-warning'} is-light`}>
                                {recipe.status || "draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <footer className="card-footer">
                        <button 
                          className="card-footer-item button is-white has-text-info"
                          onClick={() => handleEditRecipe(recipe.id)}
                        >
                          <span className="icon">
                            <i className="fas fa-edit"></i>
                          </span>
                          <span>Edit</span>
                        </button>
                        <button 
                          className="card-footer-item button is-white has-text-danger"
                          onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            recipeId: recipe.id, 
                            recipeName: recipe.title 
                          })}
                        >
                          <span className="icon">
                            <i className="fas fa-trash-alt"></i>
                          </span>
                          <span>Delete</span>
                        </button>
                      </footer>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>

        {/* Delete Confirmation Modal */}
        <div className={`modal ${deleteModal.isOpen ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={() => setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' })}></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-danger-light">
              <p className="modal-card-title has-text-danger">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  <span>Delete Recipe</span>
                </span>
              </p>
              <button 
                className="delete" 
                aria-label="close"
                onClick={() => setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' })}
              ></button>
            </header>
            <section className="modal-card-body">
              <p className="is-size-5 mb-4">Are you sure you want to delete <strong>{deleteModal.recipeName}</strong>?</p>
              <p className="has-text-grey">This action cannot be undone. All data associated with this recipe will be permanently removed.</p>
            </section>
            <footer className="modal-card-foot">
              <button 
                className="button is-danger"
                onClick={handleDeleteRecipe}
              >
                <span className="icon">
                  <i className="fas fa-trash-alt"></i>
                </span>
                <span>Yes, Delete Recipe</span>
              </button>
              <button 
                className="button"
                onClick={() => setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' })}
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRecipes;
