const API_BASE_URL = 'http://localhost:3001/api';

export const favoriteService = {
  getUserFavorites: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user-favorites/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  addFavorite: async (recipeId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user-favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipe_id: recipeId }),
    });
    return response.json();
  },

  removeFavorite: async (recipeId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user-favorites/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};
