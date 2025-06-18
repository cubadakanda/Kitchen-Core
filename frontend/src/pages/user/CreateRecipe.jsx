import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import { recipeService } from '../../services/recipeService';
import { simulateImageUpload, getSafeImageUrl, handleImageError, createImagePreview, revokeImagePreview } from '../../utils/imageUtils';
import '../../styles/bulma-home.css';

const CreateRecipe = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: 30,
    prep_time: 10,
    category_id: '',
    servings: '',
    image: null,
    status: 'published'
  });

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image file size must be less than 5MB');
      return;
    }

    try {
      // Clear any previous error
      setError(null);

      // Create immediate preview using object URL
      const previewUrl = createImagePreview(file);
      
      // Clean up previous preview URL if exists
      if (imagePreview && imagePreview.startsWith('blob:')) {
        revokeImagePreview(imagePreview);
      }
      
      setImagePreview(previewUrl);

      // Convert file to base64 for storage
      const uploadResult = await simulateImageUpload(file);
      
      if (uploadResult.success) {
        console.log(`File "${file.name}" uploaded successfully`);
        setFormData((prev) => ({ 
          ...prev, 
          image: file, 
          imageData: uploadResult.url, // base64 data
          imageFileName: uploadResult.fileName,
          imageFileSize: uploadResult.fileSize,
          imageFileType: uploadResult.fileType
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to process image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.title || !formData.description || !formData.category_id) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {      const recipeData = {
        ...formData,
        user_id: user.id,
        cook_time: parseInt(formData.cooking_time, 10),
        prep_time: parseInt(formData.prep_time, 10)
      };      // Handle image upload - send base64 data if image selected
      if (formData.imageData) {
        // New image uploaded - send base64 data
        recipeData.image_data = formData.imageData;
        recipeData.image_filename = formData.imageFileName;
        recipeData.image_type = formData.imageFileType;
        console.log('Image selected, sending base64 data:', {
          filename: formData.imageFileName,
          type: formData.imageFileType,
          size: formData.imageFileSize
        });
      }

      const response = await recipeService.createRecipe(recipeData);
      
      if (response && response.success !== false) {
        setSuccess('Recipe created successfully!');
        setTimeout(() => {
          navigate('/my-recipes');
        }, 2000);
      } else {
        setError(response?.message || 'Failed to create recipe');
      }
    } catch (err) {
      setError('An error occurred while creating recipe');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup effect to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any blob URLs when component unmounts
      if (imagePreview && imagePreview.startsWith('blob:')) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!user) {
    return (
      <div className="home-page">
        <Header user={null} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <h3 className="title is-4">Please Login</h3>
              <p>You need to be logged in to create recipes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header user={user} onLogout={handleLogout} />
      
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
                  <i className="fas fa-plus mr-3"></i>
                  Create New Recipe
                </h1>
                <p className="subtitle is-5 has-text-white-ter">
                  Share your culinary creation with the community
                </p>
              </div>
              <div className="column is-narrow">
                <button 
                  className="button is-white is-outlined"
                  onClick={() => navigate('/my-recipes')}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to My Recipes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              {/* Messages */}
              {success && (
                <div className="notification is-success is-light mb-4">
                  <button className="delete" onClick={() => setSuccess(null)}></button>
                  <i className="fas fa-check-circle mr-2"></i>
                  {success}
                </div>
              )}

              {error && (
                <div className="notification is-danger is-light mb-4">
                  <button className="delete" onClick={() => setError(null)}></button>
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              <div className="card">
                <div className="card-content">
                  <form onSubmit={handleSubmit}>
                    <div className="columns">
                      {/* Left Column */}
                      <div className="column is-7">
                        <div className="field">
                          <label className="label">Recipe Title *</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="text" 
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter recipe title"
                              required
                            />
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
                              placeholder="Brief description of your recipe"
                              required
                              rows="3"
                            />
                          </div>
                        </div>

                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label">Category *</label>
                              <div className="control">
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
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Servings</label>
                              <div className="control">
                                <input 
                                  className="input" 
                                  type="text" 
                                  name="servings"
                                  value={formData.servings}
                                  onChange={handleInputChange}
                                  placeholder="e.g. 4 servings"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label">Prep Time (minutes)</label>
                              <div className="control">
                                <input 
                                  className="input" 
                                  type="number" 
                                  name="prep_time"
                                  value={formData.prep_time}
                                  onChange={handleInputChange}
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Cooking Time (minutes)</label>
                              <div className="control">
                                <input 
                                  className="input" 
                                  type="number" 
                                  name="cooking_time"
                                  value={formData.cooking_time}
                                  onChange={handleInputChange}
                                  min="1"
                                />
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
                                {formData.image ? formData.image.name : 'No file selected'}
                              </span>
                            </label>
                          </div>
                          <p className="help">Max file size: 2MB. <br/>
                            <strong>Note:</strong> Your uploaded image will be used for the recipe. Supported formats: JPEG, PNG, WebP (max 5MB).</p>
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
                                  <i className="fas fa-image fa-3x has-text-grey-light"></i>
                                  <p className="mt-3 has-text-grey">No image selected</p>
                                </div>
                              </div>
                            </figure>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ingredients and Instructions */}
                    <div className="columns mt-4">
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
                          onClick={() => navigate('/my-recipes')}
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
                          <i className="fas fa-save mr-2"></i>
                          Create Recipe
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateRecipe;
