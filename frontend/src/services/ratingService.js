// Rating service for managing recipe ratings and reviews
const API_BASE_URL = 'http://localhost:5000/api';

// Submit a new rating/review for a recipe
export const submitRating = async (ratingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(ratingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// Get all ratings for a specific recipe
export const getRatingsByRecipeId = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/recipe/${recipeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

// Get average rating for a specific recipe
export const getAverageRating = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/recipe/${recipeId}/average`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching average rating:', error);
    throw error;
  }
};

// Update an existing rating
export const updateRating = async (ratingId, ratingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(ratingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

// Delete a rating
export const deleteRating = async (ratingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};
