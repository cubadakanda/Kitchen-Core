import { useState, useEffect } from 'react';

export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/user-favorites/user/${userId}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (recipeId) => {
    try {
      const response = await fetch('http://localhost:3001/api/user-favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ recipe_id: recipeId })
      });
      
      if (response.ok) {
        fetchFavorites(); // Refresh favorites
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user-favorites/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== recipeId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  return { 
    favorites, 
    loading, 
    addFavorite, 
    removeFavorite, 
    refetch: fetchFavorites 
  };
};
