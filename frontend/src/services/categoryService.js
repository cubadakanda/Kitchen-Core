// Mock categories data untuk fallback jika API tidak tersedia
const mockCategories = [
  { id: 1, name: 'Indonesian Food', description: 'Traditional dishes from Indonesia', recipe_count: 12, isMockData: true },
  { id: 2, name: 'Italian Food', description: 'Classic Italian cuisine', recipe_count: 8, isMockData: true },
  { id: 3, name: 'Desserts', description: 'Sweet treats and desserts', recipe_count: 15, isMockData: true },
  { id: 4, name: 'Beverages', description: 'Drinks and refreshments', recipe_count: 6, isMockData: true },
  { id: 5, name: 'Healthy Food', description: 'Nutritious and balanced meals', recipe_count: 9, isMockData: true }
];

const API_BASE_URL = 'http://localhost:5000/api';

export const categoryService = {  getAllCategories: async () => {
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/categories`);
      
      // Add timeout to fetch request to avoid long waits if server is down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/categories`, {
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        console.error(`API returned status: ${response.status}`);
        let errorData;
        
        try {
          // Try to parse JSON error response
          errorData = await response.json();
          console.error(`API error details:`, errorData);
          
          if (errorData.error && errorData.details) {
            throw new Error(`API error: ${errorData.error} - ${errorData.details}`);
          }
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            console.error(`API error details (text):`, errorText);
          } catch (textError) {
            console.error(`Could not parse error response`);
          }
        }
        
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Categories API response:', data);
      
      // Handle potential formats from API
      if (Array.isArray(data)) {
        // If we got an empty array, we might want to show some sample data anyway
        if (data.length === 0) {
          console.log('API returned empty categories array, using sample data for better UX');
          return mockCategories.map(cat => ({...cat, isEmptyApiResponse: true}));
        }
        
        // Add the recipe_count property if it doesn't exist
        const enhancedData = data.map(category => ({
          ...category,
          recipe_count: category.recipe_count || 0,
          isMockData: false
        }));
        return enhancedData;
      } else if (data && data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          console.log('API returned empty nested categories array, using sample data for better UX');
          return mockCategories.map(cat => ({...cat, isEmptyApiResponse: true}));
        }
        
        const enhancedData = data.data.map(category => ({
          ...category,
          recipe_count: category.recipe_count || 0,
          isMockData: false
        }));
        return enhancedData;
      } else {
        console.log('Using mock categories data due to unexpected API response format');
        return mockCategories.map(cat => ({...cat, unexpectedFormat: true}));
      }
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      
      // Different error message based on error type
      if (error.name === 'AbortError') {
        console.log('Request timed out, server might be down');
        return mockCategories.map(cat => ({
          ...cat, 
          connectionTimeout: true, 
          errorMessage: 'Connection to the API timed out. The server might be down or overloaded.'
        }));
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        console.log('Network error, API might be down');
        return mockCategories.map(cat => ({
          ...cat, 
          networkError: true,
          errorMessage: 'Network error occurred. The API server might be down or unreachable.'
        }));
      } else if (error.message?.includes('Database connection error')) {
        console.log('Database connection error reported by API');
        return mockCategories.map(cat => ({
          ...cat, 
          dbConnectionError: true,
          errorMessage: 'The API server reported a database connection error. MySQL might not be running.'
        }));
      } else if (error.message?.includes('500')) {
        console.log('Server error (500)');
        return mockCategories.map(cat => ({
          ...cat, 
          serverError: true,
          errorMessage: 'The server encountered an internal error (500). Check the backend logs for details.'
        }));
      } else {
        console.log('Using mock categories data as fallback');
        return mockCategories.map(cat => ({
          ...cat, 
          apiError: error.message,
          errorMessage: `API error: ${error.message || 'Unknown error'}`
        }));
      }
    }
  },
  getCategoryById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      // Find the mock category with the given ID as fallback
      const mockCategory = mockCategories.find(cat => cat.id === parseInt(id));
      return mockCategory || { error: 'Category not found' };
    }
  },
  createCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Create a mock category with an ID that's not in the mock list
      const newId = Math.max(...mockCategories.map(c => c.id), 0) + 1;
      const newCategory = {
        id: newId,
        ...categoryData,
        createdAt: new Date().toISOString(),
        isMockData: true,
        offlineCreated: true
      };
      mockCategories.push(newCategory);
      
      // Return with additional info about the mock status
      return {
        ...newCategory,
        _mockMessage: "Category was created in mock data only. Changes will not persist when the page is refreshed."
      };
    }
  },  updateCategory: async (id, categoryData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      
      // Check if this is a mock category or if we're just having connectivity issues
      const categoryIndex = mockCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIndex !== -1) {
        const wasAlreadyMock = mockCategories[categoryIndex].isMockData;
        
        mockCategories[categoryIndex] = {
          ...mockCategories[categoryIndex],
          ...categoryData,
          updatedAt: new Date().toISOString(),
          isMockData: true,
          offlineUpdated: !wasAlreadyMock
        };
        
        // Return with additional info about the mock status
        return {
          ...mockCategories[categoryIndex],
          _mockMessage: wasAlreadyMock 
            ? "Category was updated in mock data only. Changes to mock data will not persist when the page is refreshed." 
            : "API connection issue: Your changes were saved locally but not to the server."
        };
      }
      
      return { 
        error: 'Failed to update category', 
        details: error.message,
        isMockError: true
      };
    }
  },
  deleteCategory: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      
      // Check if this was a mock category
      const categoryIndex = mockCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIndex !== -1) {
        const wasAlreadyMock = mockCategories[categoryIndex].isMockData;
        
        // Keep a reference to the deleted item for potential restoration
        const deletedItem = {...mockCategories[categoryIndex]};
        
        // Remove from mock categories
        mockCategories.splice(categoryIndex, 1);
        
        return { 
          success: true, 
          message: wasAlreadyMock 
            ? 'Mock category deleted successfully' 
            : 'Category removed from local view due to API connection issues',
          _mockMessage: wasAlreadyMock
            ? "This was a sample category and was removed from the current view."
            : "API connection issue: The category was removed from your view but might not be deleted on the server.",
          deletedItem // Keep the item data in case we need to restore it
        };
      }
      
      return { 
        error: 'Failed to delete category',
        details: error.message,
        isMockError: true
      };
    }
  }
};
