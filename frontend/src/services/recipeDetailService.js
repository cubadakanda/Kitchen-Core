// Recipe service for individual recipe operations
const API_BASE_URL = 'http://localhost:5000/api';

export const fetchRecipeById = async (id) => {
  try {
    console.log('Fetching recipe by ID:', id);
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recipe fetched successfully:', data);
      // Process the recipe data to ensure proper structure
    const processedRecipe = {
      ...data,
      category: data.category || { name: 'Uncategorized' },
      user: data.user || { name: 'Unknown Chef' },
      image_url: data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      ingredients: data.ingredients || 'No ingredients available',
      instructions: data.instructions || 'No instructions available',
      cooking_time: data.cooking_time || data.cook_time || data.prep_time || 30,
      calories: data.calories || 0,
      difficulty: data.difficulty || 'Medium',
      servings: data.servings || 4
    };
    
    return processedRecipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export default fetchRecipeById;
