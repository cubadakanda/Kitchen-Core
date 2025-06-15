const API_BASE_URL = 'http://localhost:3001/api';

export const recipeService = {
  getAllRecipes: async () => {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    return response.json();
  },

  getRecipeById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return response.json();
  },

  createRecipe: async (recipeData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipeData),
    });
    return response.json();
  },

  updateRecipe: async (id, recipeData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipeData),
    });
    return response.json();
  },

  deleteRecipe: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};
