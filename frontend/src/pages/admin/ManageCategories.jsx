import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';

const ManageCategories = () => {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
  }, [error]);  const fetchCategories = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    
    try {
      console.log('Fetching categories...');
      const data = await categoryService.getAllCategories();
      
      if (Array.isArray(data)) {
        console.log('Categories fetched successfully:', data);
        setCategories(data);
        
        // Check for different types of mock data to provide appropriate messages
        if (data.length > 0) {
          if (data[0].errorMessage) {
            // Use the detailed error message if available
            console.warn('Using sample data due to error:', data[0].errorMessage);
            setError(`${data[0].errorMessage}. Using sample category data.`);
          } else if (data[0].connectionTimeout) {
            console.warn('Request timed out, using sample data');
            setError('Connection to API timed out. Using sample category data. Check if the server is running.');
          } else if (data[0].networkError) {
            console.warn('Network error, using sample data');
            setError('Network error. Using sample category data. Check your backend server connection.');
          } else if (data[0].dbConnectionError) {
            console.warn('Database connection error, using sample data');
            setError('The backend server cannot connect to the database. Check if MySQL is running.');
          } else if (data[0].serverError) {
            console.warn('Server error (500), using sample data');
            setError('The server encountered an internal error (500). Check the backend server logs.');
          } else if (data[0].unexpectedFormat) {
            console.warn('Unexpected API format, using sample data');
            setError('Received unexpected data format from API. Using sample category data.');
          } else if (data[0].isEmptyApiResponse) {
            console.warn('API returned empty data, using sample data');
            setError('API returned no categories. Using sample category data for demonstration.');
          } else if (data[0].apiError) {
            console.warn('API error, using sample data');
            setError(`API error: ${data[0].apiError}. Using sample category data.`);
          } else if (data[0].isMockData) {
            console.warn('Using mock categories due to API error');
            setError('Using sample category data. The API connection could not be established.');
          }
        }
      } else {
        console.error('Invalid data format received from API:', data);
        setError('Failed to fetch categories: Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(`Error fetching categories: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
    setEditingCategory(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, formData);
        
        if (updatedCategory._mockMessage) {
          console.warn('Mock update:', updatedCategory._mockMessage);
          // Still update the UI
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ));
          setSuccess('Category updated locally! ' + updatedCategory._mockMessage);
        } else if (updatedCategory.error) {
          throw new Error(updatedCategory.error);
        } else {
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ));
          setSuccess('Category updated successfully!');
        }
      } else {
        const newCategory = await categoryService.createCategory(formData);
        
        if (newCategory._mockMessage) {
          console.warn('Mock creation:', newCategory._mockMessage);
          // Still update the UI
          setCategories([...categories, newCategory]);
          setSuccess('Category created locally! ' + newCategory._mockMessage);
        } else if (newCategory.error) {
          throw new Error(newCategory.error);
        } else {
          setCategories([...categories, newCategory]);
          setSuccess('Category created successfully!');
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(`Error saving category: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };
  const handleDelete = async (id) => {
    try {
      const result = await categoryService.deleteCategory(id);
      
      if (result._mockMessage) {
        console.warn('Mock deletion:', result._mockMessage);
        // Still update the UI
        setCategories(categories.filter(cat => cat.id !== id));
        setSuccess('Category deleted locally! ' + result._mockMessage);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        setCategories(categories.filter(cat => cat.id !== id));
        setSuccess('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(`Error deleting category: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const confirmDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      handleDelete(category.id);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect if not admin
  if (!authLoading && (!user || user.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
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
                      <i className="fas fa-tags"></i>
                    </span>
                    <span>Manage Categories</span>
                  </span>
                </h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button 
                  className="button is-primary is-medium" 
                  onClick={() => openModal()}
                >
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add Category</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Messages */}
        <section className="section is-small py-4">          {success && (
            <div className={`notification ${success.includes('locally') ? 'is-warning' : 'is-success'} is-light`}>
              <button className="delete" onClick={() => setSuccess(null)}></button>
              <span className="icon-text">
                <span className="icon">
                  <i className={`fas ${success.includes('locally') ? 'fa-info-circle' : 'fa-check-circle'}`}></i>
                </span>
                <span>{success}</span>
              </span>
              
              {success.includes('locally') && (
                <p className="is-size-7 mt-2">
                  <i className="fas fa-exclamation-triangle mr-1"></i> 
                  Note: This change is temporary and will be lost when you refresh the page.
                </p>
              )}
            </div>
          )}          {error && (
            <div className={`notification ${error.includes('sample category data') ? 'is-warning' : 'is-danger'} is-light`}>
              <button className="delete" onClick={() => setError(null)}></button>
              <div className="content">
                <div className="is-flex is-align-items-center mb-3">
                  <span className="icon-text">
                    <span className="icon">
                      <i className={`fas ${error.includes('sample category data') ? 'fa-info-circle' : 'fa-exclamation-circle'}`}></i>
                    </span>
                    <span className="has-text-weight-medium">{error}</span>
                  </span>
                </div>
                
                {error.includes('sample category data') && (
                  <div className="mt-2 mb-3">
                    <p className="is-size-7">You can still use this page normally with sample data. Try these troubleshooting steps:</p>
                    <ul className="is-size-7 mt-1 ml-4">
                      {error.includes('database') && (
                        <>
                          <li>Check if MySQL is running on your computer</li>
                          <li>Make sure the database 'db_web' exists</li>
                          <li>Verify the username/password in Database.js are correct</li>
                        </>
                      )}
                      {error.includes('500') && (
                        <>
                          <li>Check the backend console logs for specific error details</li>
                          <li>Verify that all required database tables exist</li>
                          <li>Restart the backend server to clear any runtime errors</li>
                        </>
                      )}
                      {error.includes('timed out') && (
                        <>
                          <li>Check that the backend server is running at port 5000</li>
                          <li>The server might be overloaded or unresponsive</li>
                          <li>Try restarting the backend server</li>
                        </>
                      )}
                      {!error.includes('database') && !error.includes('500') && !error.includes('timed out') && (
                        <>
                          <li>Check that the backend server is running at port 5000</li>
                          <li>Verify your database connection in the backend</li>
                          <li>Check for any CORS issues in the browser console</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="is-flex is-align-items-center is-justify-content-space-between mt-2">
                  <span></span>
                  <div>
                    <button 
                      className={`button is-small ${error.includes('sample category data') ? 'is-warning' : 'is-danger'} is-inverted mr-2`}
                      onClick={() => setError(null)}
                    >
                      <span className="icon is-small">
                        <i className="fas fa-times"></i>
                      </span>
                      <span>Dismiss</span>
                    </button>
                    <button 
                      className={`button is-small ${error.includes('sample category data') ? 'is-warning' : 'is-danger'} is-light`}
                      onClick={fetchCategories}
                    >
                      <span className="icon is-small">
                        <i className="fas fa-sync-alt"></i>
                      </span>
                      <span>Retry Connection</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Search Controls */}
        <section className="section is-small py-4">
          <div className="card admin-card">
            <div className="card-content">
              <div className="field">
                <label className="label">Search Categories</label>
                <div className="control has-icons-left">
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Search by name or description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Table */}
        <section className="section is-small py-4">
          <div className="card admin-card">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fas fa-table"></i>
                  </span>
                  <span>Categories List</span>
                </span>
              </p>
            </header>
            <div className="card-content p-0">              {loading ? (
                <div className="has-text-centered py-6">
                  <span className="icon is-large">
                    <i className="fas fa-spinner fa-pulse fa-2x"></i>
                  </span>
                  <p className="mt-3">Loading categories...</p>
                </div>
              ) : error ? (
                <div className="has-text-centered py-6">
                  <span className="icon is-large has-text-danger">
                    <i className="fas fa-exclamation-circle fa-2x"></i>
                  </span>
                  <p className="mt-3 has-text-danger">{error}</p>
                  <button 
                    className="button is-danger is-outlined mt-4"
                    onClick={fetchCategories}
                  >
                    <span className="icon">
                      <i className="fas fa-sync-alt"></i>
                    </span>
                    <span>Try Again</span>
                  </button>
                </div>
              ) : filteredCategories.length > 0 ? (
                <div className="table-container">
                  <table className="table is-fullwidth is-striped is-hoverable admin-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th className="has-text-centered">Recipe Count</th>
                        <th className="has-text-centered">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map(category => (
                        <tr key={category.id}>
                          <td>
                            <div className="is-flex is-align-items-center">
                              <figure className="image is-32x32 mr-3">
                                <div className="has-background-primary is-flex is-align-items-center is-justify-content-center has-text-white has-text-weight-bold" 
                                     style={{borderRadius: '8px', width: '32px', height: '32px'}}>
                                  <i className="fas fa-tag"></i>
                                </div>
                              </figure>
                              <p className="has-text-weight-semibold">{category.name}</p>
                            </div>
                          </td>
                          <td>
                            <span className="has-text-grey">
                              {category.description || 'No description provided'}
                            </span>
                          </td>
                          <td className="has-text-centered">
                            <span className="tag is-info is-light">
                              {category.recipe_count || 0}
                            </span>
                          </td>
                          <td>
                            <div className="buttons is-centered">
                              <button 
                                className="button is-small is-info is-light"
                                onClick={() => openModal(category)}
                              >
                                <span className="icon is-small">
                                  <i className="fas fa-edit"></i>
                                </span>
                                <span>Edit</span>
                              </button>
                              <button 
                                className="button is-small is-danger is-light"
                                onClick={() => confirmDelete(category)}
                              >
                                <span className="icon is-small">
                                  <i className="fas fa-trash-alt"></i>
                                </span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="has-text-centered py-6">
                  <span className="icon is-large">
                    <i className="fas fa-tag fa-3x has-text-grey-light"></i>
                  </span>
                  <p className="mt-3 has-text-grey">
                    {searchQuery ? 'No categories found matching your search' : 'No categories available'}
                  </p>
                  {searchQuery ? (
                    <button 
                      className="button is-primary mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button 
                      className="button is-primary mt-4"
                      onClick={() => openModal()}
                    >
                      Add Your First Category
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Category Form Modal */}
        <div className={`modal ${modalActive ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                <span className="icon-text">
                  <span className="icon">
                    <i className={`fas fa-${editingCategory ? 'edit' : 'plus'}`}></i>
                  </span>
                  <span>{editingCategory ? 'Edit Category' : 'Add New Category'}</span>
                </span>
              </p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              <form id="categoryForm" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Category Name</label>
                  <div className="control">
                    <input 
                      className="input" 
                      type="text" 
                      placeholder="e.g. Appetizers, Desserts, etc."
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Description</label>
                  <div className="control">
                    <textarea 
                      className="textarea" 
                      placeholder="Provide a short description of this category"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                    ></textarea>
                  </div>
                  <p className="help">Optional: A brief description helps users understand what recipes belong in this category</p>
                </div>
              </form>
            </section>
            <footer className="modal-card-foot">
              <button 
                type="submit" 
                form="categoryForm" 
                className="button is-primary"
              >
                <span className="icon">
                  <i className="fas fa-save"></i>
                </span>
                <span>{editingCategory ? 'Update' : 'Create'} Category</span>
              </button>
              <button 
                className="button" 
                onClick={closeModal}
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

export default ManageCategories;
