import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { recipeService } from '../../services/recipeService';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: 30,
    prep_time: 10, // Add prep_time field
    difficulty: 'medium',
    category_id: '',
    image: null
  });

  // Fetch recipe data and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      
      try {
        // Fetch recipe details
        const recipeResponse = await recipeService.getRecipeById(id);
        if (recipeResponse && recipeResponse.success !== false && recipeResponse.data) {
          const recipeData = recipeResponse.data;          setFormData({
            title: recipeData.title || '',
            description: recipeData.description || '',
            ingredients: recipeData.ingredients || '',
            instructions: recipeData.instructions || '',
            cooking_time: recipeData.cook_time || 30, // Map cook_time from API to cooking_time for form
            prep_time: recipeData.prep_time || 10, // Add prep_time mapping
            difficulty: recipeData.difficulty || 'medium',
            category_id: recipeData.category_id || '',
            image: null
          });
          
          // Set image preview if available
          if (recipeData.image) {
            setImagePreview(recipeData.image.startsWith('http') 
              ? recipeData.image 
              : `http://localhost:5000/${recipeData.image}`);
          }
        } else {
          setError('Failed to fetch recipe data');
          setTimeout(() => {
            navigate('/admin/recipes');
          }, 3000);
        }
        
        // Fetch categories
        try {
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
      } catch (err) {
        setError('An error occurred while fetching recipe data');
        console.error(err);
        setTimeout(() => {
          navigate('/admin/recipes');
        }, 3000);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

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
        cook_time: parseInt(formData.cooking_time, 10) // Map cooking_time to cook_time for API
      };

      const response = await recipeService.updateRecipe(id, recipeData);
      
      if (response && response.success !== false) {
        setSuccess('Recipe updated successfully!');
        setTimeout(() => {
          navigate('/admin/recipes');
        }, 2000);
      } else {
        setError(response?.message || 'Failed to update recipe');
      }
    } catch (err) {
      setError('An error occurred while saving recipe data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="section has-text-centered">
          <div className="container">
            <div className="box p-6" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <span className="icon is-large has-text-primary">
                  <i className="fas fa-spinner fa-pulse fa-3x"></i>
                </span>
                <p className="mt-4 is-size-5 has-text-grey">Loading recipe data...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                      <i className="fas fa-edit"></i>
                    </span>
                    <span>Edit Recipe</span>
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
            Editing "{formData.title}"
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
                                  name="cooking_time"
                                  value={formData.cooking_time}
                                  onChange={handleInputChange}
                                  min="1"
                                />
                                <span className="icon is-left">
                                  <i className="fas fa-clock"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Serving Size</label>
                              <div className="control has-icons-left">
                                <input 
                                  className="input" 
                                  type="text" 
                                  name="servings"
                                  value={formData.servings || ''}
                                  onChange={handleInputChange}
                                  placeholder="e.g. 4 servings"
                                />
                                <span className="icon is-left">
                                  <i className="fas fa-users"></i>
                                </span>
                              </div>
                            </div>
                          </div>
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
                                {formData.image ? formData.image.name : 'No new file selected'}
                              </span>
                            </label>
                          </div>
                          <p className="help">Max file size: 2MB. Leave empty to keep the current image.</p>
                        </div>

                        <div className="image-preview mt-4">
                          {imagePreview ? (
                            <figure className="image is-4by3">
                              <img 
                                src={imagePreview} 
                                alt="Recipe preview" 
                                style={{ objectFit: 'cover', borderRadius: '6px' }}
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = "https://bulma.io/images/placeholders/1280x720.png";
                                }}
                              />
                              <figcaption className="has-text-centered mt-2 has-text-grey is-size-7">
                                {formData.image ? 'New image selected' : 'Current image'}
                              </figcaption>
                            </figure>
                          ) : (
                            <figure className="image is-4by3">
                              <div className="has-background-light is-flex is-align-items-center is-justify-content-center" style={{ height: '100%', borderRadius: '6px', border: '2px dashed #dbdbdb' }}>
                                <div className="has-text-centered">
                                  <span className="icon is-large has-text-grey-light">
                                    <i className="fas fa-image fa-3x"></i>
                                  </span>
                                  <p className="mt-3 has-text-grey">No image available</p>
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
                          <span>Update Recipe</span>
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

export default EditRecipe;
