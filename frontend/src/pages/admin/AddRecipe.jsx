import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { recipeService } from '../../services/recipeService';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prep_time: 10,
    cook_time: 30,
    difficulty: 'medium',
    servings: '2 porsi',
    category_id: '',
    image: null,
    status: 'published'
  });

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from API
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback categories
        setCategories([
          { id: 1, name: 'Indonesian Food' },
          { id: 2, name: 'Italian Food' },
          { id: 3, name: 'Desserts' },
          { id: 4, name: 'Beverages' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Auto-hide success and error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: file }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.title || !formData.description || !formData.category_id) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }    try {
      // Format the recipe data for API
      const recipeData = {
        ...formData,
        cook_time: parseInt(formData.cook_time, 10)
      };

      const response = await recipeService.createRecipe(recipeData);
      
      if (response && response.success) {
        setSuccess('Recipe created successfully!');
        setTimeout(() => {
          navigate('/admin/recipes');
        }, 2000);
      } else {
        setError(response?.message || 'Failed to create recipe');
      }
    } catch (err) {
      setError('An error occurred while saving recipe data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
                      <i className="fas fa-plus-circle"></i>
                    </span>
                    <span>Add New Recipe</span>
                  </span>
                </h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button 
                  className="button is-primary is-outlined is-medium"
                  onClick={() => navigate('/admin/recipes')}
                >
                  <span className="icon">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                  <span>Back to Recipes</span>
                </button>
              </div>
            </div>
          </div>
          <p className="subtitle is-5 has-text-grey">
            Create a new recipe to share with your users
          </p>
        </section>

        {/* Notification Messages */}
        <section className="section is-small py-4">
          {success && (
            <div className="notification is-success is-light">
              <button className="delete" onClick={() => setSuccess(null)}></button>
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-check-circle"></i>
                </span>
                <span>{success}</span>
              </span>
            </div>
          )}

          {error && (
            <div className="notification is-danger is-light">
              <button className="delete" onClick={() => setError(null)}></button>
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-exclamation-circle"></i>
                </span>
                <span>{error}</span>
              </span>
            </div>
          )}
        </section>

        {/* Recipe Form */}
        <section className="section">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="card admin-card">
                <header className="card-header">
                  <p className="card-header-title">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-utensils"></i>
                      </span>
                      <span>Recipe Information</span>
                    </span>
                  </p>
                </header>                
                <div className="card-content">
                  <form onSubmit={handleSubmit}>
                    <div className="columns">
                      {/* Left Column - Basic Info */}
                      <div className="column is-7">
                        <div className="field">
                          <label className="label">Recipe Title *</label>
                          <div className="control has-icons-left">
                            <input 
                              className="input" 
                              type="text" 
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter recipe title"
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-clipboard-list"></i>
                            </span>
                          </div>
                        </div>

                        <div className="field">
                          <label className="label">Description *</label>
                          <div className="control">
                            <textarea 
                              className="textarea" 
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Brief description of the recipe"
                              required
                              rows="3"
                            />
                          </div>
                          <p className="help">A short and appealing description of the dish</p>
                        </div>

                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label">Category *</label>
                              <div className="control has-icons-left">
                                <div className="select is-fullwidth">
                                  <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                      <option key={category.id} value={category.id}>
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <span className="icon is-left">
                                  <i className="fas fa-tag"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Difficulty</label>
                              <div className="control has-icons-left">
                                <div className="select is-fullwidth">
                                  <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                  >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                  </select>
                                </div>
                                <span className="icon is-left">
                                  <i className="fas fa-chart-line"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label">Prep Time (minutes)</label>
                              <div className="control has-icons-left">
                                <input 
                                  className="input" 
                                  type="number" 
                                  name="prep_time"
                                  value={formData.prep_time}
                                  onChange={handleInputChange}
                                  min="0"
                                />
                                <span className="icon is-left">
                                  <i className="fas fa-hourglass-start"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Cooking Time (minutes)</label>
                              <div className="control has-icons-left">
                                <input 
                                  className="input" 
                                  type="number" 
                                  name="cook_time"
                                  value={formData.cook_time}
                                  onChange={handleInputChange}
                                  min="1"
                                />
                                <span className="icon is-left">
                                  <i className="fas fa-clock"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="field">
                          <label className="label">Serving Size</label>
                          <div className="control has-icons-left">
                            <input 
                              className="input" 
                              type="text" 
                              name="servings"
                              value={formData.servings || ''}
                              onChange={handleInputChange}                              placeholder="e.g. 4 servings"
                            />                            <span className="icon is-left">
                              <i className="fas fa-users"></i>
                            </span>                          </div>
                        </div>
                      </div>

                      {/* Right Column - Image */}
                      <div className="column is-5">
                        <div className="field">
                          <label className="label">Recipe Image</label>
                          <div className="file has-name is-fullwidth">
                            <label className="file-label">
                              <input 
                                className="file-input" 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              <span className="file-cta">
                                <span className="file-icon">
                                  <i className="fas fa-upload"></i>
                                </span>
                                <span className="file-label">
                                  Choose a file…
                                </span>
                              </span>
                              <span className="file-name">
                                {formData.image ? formData.image.name : 'No file selected'}
                              </span>
                            </label>
                          </div>
                          <p className="help">Max file size: 2MB</p>
                        </div>

                        <div className="image-preview mt-4">
                          {imagePreview ? (
                            <figure className="image is-4by3">
                              <img 
                                src={imagePreview} 
                                alt="Recipe preview" 
                                style={{ objectFit: 'cover', borderRadius: '6px' }}
                              />
                            </figure>
                          ) : (
                            <figure className="image is-4by3">
                              <div className="has-background-light is-flex is-align-items-center is-justify-content-center" style={{ height: '100%', borderRadius: '6px', border: '2px dashed #dbdbdb' }}>
                                <div className="has-text-centered">
                                  <span className="icon is-large has-text-grey-light">
                                    <i className="fas fa-image fa-3x"></i>
                                  </span>
                                  <p className="mt-3 has-text-grey">Recipe image preview</p>
                                </div>
                              </div>
                            </figure>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ingredients and Instructions */}
                    <div className="columns mt-5">
                      <div className="column is-6">
                        <div className="field">
                          <label className="label">Ingredients</label>
                          <div className="control">
                            <textarea 
                              className="textarea" 
                              name="ingredients"
                              value={formData.ingredients}
                              onChange={handleInputChange}
                              placeholder="Enter ingredients line by line"
                              rows="8"
                            />
                          </div>
                          <p className="help">Put each ingredient on a new line</p>
                        </div>
                      </div>
                      <div className="column is-6">
                        <div className="field">
                          <label className="label">Instructions</label>
                          <div className="control">
                            <textarea 
                              className="textarea" 
                              name="instructions"
                              value={formData.instructions}
                              onChange={handleInputChange}
                              placeholder="Enter preparation steps"
                              rows="8"
                            />
                          </div>
                          <p className="help">Put each instruction step on a new line</p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-grouped is-grouped-right mt-5 pt-4" style={{ borderTop: '1px solid #eee' }}>
                      <div className="control">
                        <button 
                          type="button" 
                          className="button is-light"
                          onClick={() => navigate('/admin/recipes')}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="control">
                        <button 
                          type="submit" 
                          className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                          disabled={isLoading}
                        >
                          <span className="icon">
                            <i className="fas fa-save"></i>
                          </span>
                          <span>Save Recipe</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AddRecipe;
