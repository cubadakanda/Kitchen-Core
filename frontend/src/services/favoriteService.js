const API_BASE_URL = 'http://localhost:5000/api';

export const favoriteService = {
  getUserFavorites: async (userId) => {
    try {
      console.log('Fetching favorites for user:', userId);
      const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Favorites response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No favorites found for user');
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Favorites data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      // Return empty array instead of throwing error to prevent app crash
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        console.error('Backend server might not be running on port 5000');
      }
      return [];
    }
  },

  addFavorite: async (userId, recipeId) => {
    try {
      console.log('Adding favorite - User:', userId, 'Recipe:', recipeId);
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          user_id: userId,
          recipe_id: recipeId 
        }),
      });
      
      console.log('Add favorite response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Favorite added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  removeFavorite: async (userId, recipeId) => {
    try {
      console.log('Removing favorite - User:', userId, 'Recipe:', recipeId);
      const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}/recipe/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Remove favorite response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Favorite removed successfully:', data);
      return data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  checkIsFavorite: async (userId, recipeId) => {
    try {
      console.log('Checking favorite status - User:', userId, 'Recipe:', recipeId);
      const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}/recipe/${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Check favorite response status:', response.status);
      
      if (response.status === 404) {
        console.log('Recipe is not favorited');
        return false;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const isFavorited = data !== null && data !== undefined;
      console.log('Is favorited:', isFavorited);
      return isFavorited;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        console.error('Backend server might not be running on port 5000');
      }
      return false;
    }
  }
};
