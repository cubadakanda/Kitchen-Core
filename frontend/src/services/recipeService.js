// Mock recipes data
const mockRecipes = [
  {
    id: 1,
    title: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan bumbu rempah pilihan dan telur',
    ingredients: 'Nasi putih\nTelur ayam\nBawang merah\nBawang putih\nKecap manis\nCabai\nGaram\nMinyak goreng',
    instructions: 'Panaskan minyak dalam wajan\nTumis bawang merah dan putih hingga harum\nMasukkan telur, orak-arik\nTambahkan nasi putih\nBeri kecap manis dan garam\nAduk rata dan sajikan',
    cooking_time: 20,
    difficulty: 'easy',
    category_name: 'Indonesian Food',
    category_id: 1,
    image: '/recipe1.jpg',
    rating: 4.5
  },
  {
    id: 2,
    title: 'Spaghetti Carbonara',
    description: 'Pasta Italia klasik dengan saus creamy',
    ingredients: 'Spaghetti\nTelur\nKeju parmesan\nBacon\nBawang putih\nMerica hitam\nGaram',
    instructions: 'Rebus spaghetti hingga al dente\nGoreng bacon hingga crispy\nCampur telur dengan keju parmesan\nCampur pasta dengan saus telur\nTaburi merica hitam dan sajikan',
    cooking_time: 25,
    difficulty: 'medium',
    category_name: 'Italian Food',
    category_id: 2,
    image: '/recipe2.jpg',
    rating: 4.7
  },
  {
    id: 3,
    title: 'Rendang Daging',
    description: 'Masakan khas Padang dengan cita rasa yang kaya',
    ingredients: 'Daging sapi\nSantan kelapa\nSerai\nDaun jeruk\nLengkuas\nCabai merah\nBawang merah\nBawang putih\nKemiri',
    instructions: 'Haluskan bumbu\nTumis bumbu hingga harum\nMasukkan daging, aduk rata\nTuang santan\nMasak dengan api kecil hingga mengental\nSajikan dengan nasi putih',
    cooking_time: 120,
    difficulty: 'hard',
    category_name: 'Indonesian Food',
    category_id: 1,
    image: '/recipe3.jpg',
    rating: 4.9
  }
];

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const recipeService = {
  getAllRecipes: async () => {
    try {
      await delay(500);
      return {
        success: true,
        data: mockRecipes
      };
    } catch (error) {
      // Fallback to real API if available
      try {
        const response = await fetch(`${API_BASE_URL}/recipes`);
        return response.json();
      } catch (apiError) {
        return {
          success: true,
          data: mockRecipes
        };
      }
    }
  },

  getRecipeById: async (id) => {
    try {
      await delay(300);
      const recipe = mockRecipes.find(r => r.id === parseInt(id));
      return {
        success: true,
        data: recipe || null
      };
    } catch (error) {
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
        return response.json();
      } catch (apiError) {
        return {
          success: false,
          message: 'Recipe not found'
        };
      }
    }
  },

  createRecipe: async (recipeData) => {
    try {
      await delay(800);
      const newRecipe = {
        id: mockRecipes.length + 1,
        ...recipeData,
        category_name: 'General'
      };
      mockRecipes.push(newRecipe);
      return {
        success: true,
        message: 'Recipe created successfully',
        data: newRecipe
      };
    } catch (error) {
      try {
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
      } catch (apiError) {
        return {
          success: false,
          message: 'Failed to create recipe'
        };
      }
    }
  },

  updateRecipe: async (id, recipeData) => {
    try {
      await delay(800);
      const index = mockRecipes.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        mockRecipes[index] = { ...mockRecipes[index], ...recipeData };
        return {
          success: true,
          message: 'Recipe updated successfully',
          data: mockRecipes[index]
        };
      }
      return {
        success: false,
        message: 'Recipe not found'
      };
    } catch (error) {
      try {
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
      } catch (apiError) {
        return {
          success: false,
          message: 'Failed to update recipe'
        };
      }
    }
  },

  deleteRecipe: async (id) => {
    try {
      await delay(500);
      const index = mockRecipes.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        mockRecipes.splice(index, 1);
        return {
          success: true,
          message: 'Recipe deleted successfully'
        };
      }
      return {
        success: false,
        message: 'Recipe not found'
      };
    } catch (error) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response.json();
      } catch (apiError) {
        return {
          success: false,
          message: 'Failed to delete recipe'
        };
      }
    }
  }
};
