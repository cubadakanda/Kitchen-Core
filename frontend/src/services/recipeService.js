// Mock recipes data - used as fallback if API fails
const mockRecipes = [
  {
    id: 1,
    user_id: 1, 
    category_id: 1,
    title: 'Nasi Goreng Spesial',
    slug: 'nasi-goreng-spesial',
    description: 'Nasi goreng dengan bumbu rempah pilihan dan telur',
    ingredients: 'Nasi putih\nTelur ayam\nBawang merah\nBawang putih\nKecap manis\nCabai\nGaram\nMinyak goreng',
    instructions: 'Panaskan minyak dalam wajan\nTumis bawang merah dan putih hingga harum\nMasukkan telur, orak-arik\nTambahkan nasi putih\nBeri kecap manis dan garam\nAduk rata dan sajikan',
    image_url: '/images/recipes/nasi-goreng.jpg',
    prep_time: 10,
    cook_time: 15,
    servings: '2 porsi',
    status: 'published',
    category_name: 'Indonesian Food' // Added for UI display
  },
  {
    id: 2,
    user_id: 1,
    category_id: 2,
    title: 'Spaghetti Carbonara',
    slug: 'spaghetti-carbonara',
    description: 'Pasta Italia klasik dengan saus creamy',
    ingredients: 'Spaghetti\nTelur\nKeju parmesan\nBacon\nBawang putih\nMerica hitam\nGaram',
    instructions: 'Rebus spaghetti hingga al dente\nGoreng bacon hingga crispy\nCampur telur dengan keju parmesan\nCampur pasta dengan saus telur\nTaburi merica hitam dan sajikan',
    image_url: '/images/recipes/spaghetti.jpg',
    prep_time: 10,
    cook_time: 15,
    servings: '2 porsi',
    status: 'published',
    category_name: 'Italian Food' // Added for UI display
  },
  {
    id: 3,
    user_id: 1,
    category_id: 1,
    title: 'Rendang Daging',
    slug: 'rendang-daging',
    description: 'Masakan khas Padang dengan cita rasa yang kaya',
    ingredients: 'Daging sapi\nSantan kelapa\nSerai\nDaun jeruk\nLengkuas\nCabai merah\nBawang merah\nBawang putih\nKemiri',
    instructions: 'Haluskan bumbu\nTumis bumbu hingga harum\nMasukkan daging, aduk rata\nTuang santan\nMasak dengan api kecil hingga mengental\nSajikan dengan nasi putih',
    image_url: '/images/recipes/rendang.jpg',
    prep_time: 30,
    cook_time: 120,
    servings: '4 porsi',
    status: 'published',
    category_name: 'Indonesian Food' // Added for UI display
  }
];

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const recipeService = {
  // Helper function to get token from localStorage
  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  // Get all recipes
  getAllRecipes: async () => {
    try {
      console.log('Fetching all recipes from API...');
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        headers: {
          ...recipeService.getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If data is empty or not an array, fallback to mock data
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('No recipes returned from API, falling back to mock data...');
        return mockRecipes;
      }
      
      // Add category names for display if needed
      const recipesWithCategories = await recipeService.addCategoryNamesToRecipes(data);
      return recipesWithCategories;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      console.log('Falling back to mock data...');
      return mockRecipes;
    }
  },
  // Helper function to add category names to recipes and fix image URLs
  addCategoryNamesToRecipes: async (recipes) => {
    if (!Array.isArray(recipes) || recipes.length === 0) return recipes;
    
    try {
      // Fetch categories if needed
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
      if (!categoriesResponse.ok) return recipes;
      
      const categories = await categoriesResponse.json();
      
      // Map categories for quick lookup
      const categoryMap = {};
      categories.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      
      // Add category_name to each recipe and fix image URLs
      return recipes.map(recipe => {
        let imageUrl = recipe.image_url;
        
        // Fix image URLs - ensure they have full path
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
          imageUrl = `/${imageUrl}`;
        }
        
        return {
          ...recipe,
          image_url: imageUrl,
          category_name: categoryMap[recipe.category_id] || 'Uncategorized'
        };
      });
    } catch (error) {
      console.error('Error adding category names:', error);
      return recipes;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      console.log(`Fetching recipe with id ${id} from API...`);
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        headers: {
          ...recipeService.getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const recipe = await response.json();
      
      // Add category name if needed
      try {
        const categoryResponse = await fetch(`${API_BASE_URL}/categories/${recipe.category_id}`);
        if (categoryResponse.ok) {
          const category = await categoryResponse.json();
          recipe.category_name = category.name;
        }
      } catch (categoryError) {
        console.error('Error fetching category:', categoryError);
      }
      
      return {
        success: true,
        data: recipe
      };
    } catch (error) {
      console.error('Error fetching recipe:', error);
      console.log('Falling back to mock data...');
      
      // Try to find in mock data as fallback
      const recipe = mockRecipes.find(r => r.id === parseInt(id));
      return {
        success: recipe ? true : false,
        data: recipe || null,
        message: recipe ? null : 'Recipe not found'
      };
    }
  },
  // Generate a slug from title
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  },

  // Create new recipe
  createRecipe: async (recipeData) => {
    try {
      console.log('Preparing to create recipe:', recipeData);
      
      // Get current user from localStorage for user_id
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      
      // Format data to match backend schema
      const formattedData = {
        user_id: currentUser.id || 1, // Fallback to 1 if not found
        category_id: parseInt(recipeData.category_id, 10),
        title: recipeData.title,
        slug: recipeService.generateSlug(recipeData.title),
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prep_time: recipeData.prep_time || 0,
        cook_time: recipeData.cook_time || 0,
        servings: recipeData.servings || '',
        status: 'published',
        image_url: recipeData.image_url || null
      };
      
      // Handle image upload if needed
      if (recipeData.image && typeof recipeData.image !== 'string') {
        // In a real app, you would upload the image to a server here
        // and get the image URL back to store in formattedData.image_url
        formattedData.image_url = URL.createObjectURL(recipeData.image); // Temporary preview URL
      }
      
      console.log('Formatted data for API:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...recipeService.getAuthHeader()
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status}, ${errorText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        message: 'Recipe created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating recipe:', error);
      
      // Use mock data as fallback for demo purposes
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using mock data as fallback...');
        const newRecipe = {
          id: mockRecipes.length + 1,
          user_id: 1,
          category_id: parseInt(recipeData.category_id, 10) || 1,
          title: recipeData.title,
          slug: recipeService.generateSlug(recipeData.title),
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          prep_time: recipeData.prep_time || 0,
          cook_time: recipeData.cook_time || 0,
          servings: recipeData.servings || '',
          status: 'published',
          image_url: recipeData.image ? URL.createObjectURL(recipeData.image) : null,
          category_name: 'Demo Category'
        };
        mockRecipes.push(newRecipe);
        return {
          success: true,
          message: '(DEMO) Recipe created successfully',
          data: newRecipe
        };
      }
      
      return {
        success: false,
        message: `Failed to create recipe: ${error.message}`
      };
    }
  },
  // Update existing recipe
  updateRecipe: async (id, recipeData) => {
    try {
      console.log(`Updating recipe with id ${id}:`, recipeData);
      
      // Format data to match backend schema
      const formattedData = {
        category_id: parseInt(recipeData.category_id, 10),
        title: recipeData.title,
        slug: recipeService.generateSlug(recipeData.title),
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prep_time: recipeData.prep_time || 0,
        cook_time: recipeData.cook_time || 0,
        servings: recipeData.servings || '',
        status: recipeData.status || 'published'
      };
        // Handle image upload if needed
      if (recipeData.image && typeof recipeData.image !== 'string') {
        // In a real app, you would upload the image to a server here
        // For now, we'll just use a placeholder since we don't have image upload functionality
        console.log('New image file detected, but image upload not implemented');
        // Don't set image_url for new files, let backend handle it
      } else if (recipeData.image_url) {
        // Preserve existing image_url if no new image is selected
        formattedData.image_url = recipeData.image_url;
      }
      
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PATCH', // Using PATCH as seen in routes
        headers: {
          'Content-Type': 'application/json',
          ...recipeService.getAuthHeader()
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status}, ${errorText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        message: 'Recipe updated successfully',
        data: result
      };
    } catch (error) {
      console.error('Error updating recipe:', error);
      
      // Use mock data as fallback for demo purposes
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using mock data as fallback...');
        const index = mockRecipes.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
          mockRecipes[index] = { 
            ...mockRecipes[index], 
            ...recipeData,
            slug: recipeService.generateSlug(recipeData.title)
          };
          return {
            success: true,
            message: '(DEMO) Recipe updated successfully',
            data: mockRecipes[index]
          };
        }
      }
      
      return {
        success: false,
        message: `Failed to update recipe: ${error.message}`
      };
    }
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    try {
      console.log(`Deleting recipe with id ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          ...recipeService.getAuthHeader()
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status}, ${errorText}`);
      }
      
      return {
        success: true,
        message: 'Recipe deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      
      // Use mock data as fallback for demo purposes
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using mock data as fallback...');
        const index = mockRecipes.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
          mockRecipes.splice(index, 1);
          return {
            success: true,
            message: '(DEMO) Recipe deleted successfully'
          };
        }
      }
      
      return {
        success: false,
        message: `Failed to delete recipe: ${error.message}`
      };
    }
  }
};
