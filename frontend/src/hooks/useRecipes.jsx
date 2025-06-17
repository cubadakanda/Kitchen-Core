import { useState, useEffect } from 'react';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
      return data; // Return the data for direct use
    } catch (err) {
      setError(err.message);
      return []; // Return empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, fetchRecipes, refetch: fetchRecipes };
};

export default useRecipes;
