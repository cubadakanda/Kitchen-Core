import { useState, useEffect, useCallback } from 'react';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching recipes from API...');
      const response = await fetch('http://localhost:5000/api/recipes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Recipes fetched successfully:', data);
      setRecipes(data);
      return data; // Return the data for direct use
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      // Return mock data as fallback
      const mockRecipes = [
        {
          id: 1,
          title: "Nasi Goreng Spesial",
          description: "Nasi goreng dengan bumbu rahasia yang lezat",
          image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3",
          cooking_time: 30,
          calories: 450,
          category: { name: "Indonesian" }
        },
        {
          id: 2,
          title: "Spaghetti Carbonara",
          description: "Pasta Italia klasik dengan saus creamy",
          image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3",
          cooking_time: 25,
          calories: 520,
          category: { name: "Italian" }
        },
        {
          id: 3,
          title: "Chicken Teriyaki",
          description: "Ayam dengan saus teriyaki yang manis gurih",
          image_url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3",
          cooking_time: 35,
          calories: 380,
          category: { name: "Japanese" }
        }
      ];      setRecipes(mockRecipes);
      return mockRecipes;
    } finally {
      setLoading(false);
    }
  }, []); // useCallback dependency array
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]); // Sekarang fetchRecipes stabil dengan useCallback

  return { recipes, loading, error, fetchRecipes, refetch: fetchRecipes };
};

export default useRecipes;
