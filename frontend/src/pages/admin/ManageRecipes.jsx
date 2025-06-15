import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category_id: '',
    cooking_time: '',
    difficulty: 'easy'
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // Fetch recipes from API
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle create/update recipe
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData(recipe);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      // Delete recipe
    }
  };

  return (
    <AdminLayout>
      <div className="manage-recipes">
        <div className="page-header">
          <h1>Manage Recipes</h1>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Recipe
          </button>
        </div>

        {showForm && (
          <div className="recipe-form-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
                <button onClick={() => setShowForm(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Ingredients</label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    rows="5"
                    placeholder="Enter ingredients, one per line"
                  />
                </div>
                
                <div className="form-group">
                  <label>Instructions</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    rows="6"
                    placeholder="Enter cooking instructions"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Cooking Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.cooking_time}
                      onChange={(e) => setFormData({...formData, cooking_time: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingRecipe ? 'Update' : 'Create'} Recipe
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="recipes-table">
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Cooking Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map(recipe => (
                  <tr key={recipe.id}>
                    <td>{recipe.title}</td>
                    <td>{recipe.category_name}</td>
                    <td>{recipe.difficulty}</td>
                    <td>{recipe.cooking_time} min</td>
                    <td>
                      <button onClick={() => handleEdit(recipe)}>Edit</button>
                      <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRecipes;
