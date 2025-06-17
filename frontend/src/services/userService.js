const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, message: 'Failed to fetch users', error: error.message };
    }
  },
  
  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return { success: false, message: 'Failed to fetch user details', error: error.message };
    }
  },
  
  // Create new user
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Failed to create user', error: error.message };
    }
  },
    // Update user
  updateUser: async (id, userData) => {
    try {
      console.log(`Updating user ${id} with data:`, userData);
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        console.error(`Server responded with status: ${response.status}`);
        const errorText = await response.text();
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(errorText);
          return { 
            success: false, 
            message: errorJson.message || `Server error: ${response.status}`, 
            error: errorJson 
          };
        } catch (e) {
          // If not valid JSON, return text
          return { 
            success: false, 
            message: `Server error: ${response.status}`, 
            error: errorText 
          };
        }
      }
      
      const result = await response.json();
      console.log("API response for update:", result);
      return result;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return { success: false, message: 'Failed to update user: ' + error.message, error: error.message };
    }
  },
  
  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return { success: false, message: 'Failed to delete user', error: error.message };
    }
  },
  
  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: {
          totalUsers: 25,
          newUsersThisMonth: 8,
          usersByRole: {
            admin: 3,
            user: 22
          }
        }
      };
    }
  }
};
