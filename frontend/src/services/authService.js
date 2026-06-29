// Mock data untuk development tanpa backend
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@kitchencore.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'user@kitchencore.com',
    password: 'user123',
    role: 'user'
  }
];

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials) => {
    try {
      console.log('🔄 Attempting login with backend API...');
      console.log('API URL:', `${API_BASE_URL}/users/login`);
      
      // Try real API first
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('📡 Response data:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ API Error:', error);
      console.log('🔄 Falling back to mock data...');
      
      // Fallback to mock data
      await delay(1000);
      
      const user = mockUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        return {
          success: true,
          message: 'Login successful (Mock - Backend unavailable)',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            },
            token: `mock-token-${user.id}`
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password (Mock)'
        };
      }
    }
  },

  register: async (userData) => {
    try {
      console.log('🔄 Attempting register with backend API...');
      console.log('API URL:', `${API_BASE_URL}/users/register`);
      console.log('📤 Sending data:', userData);
      
      // Try real API first
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('📡 Response data:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ API Error:', error);
      console.log('🔄 Falling back to mock data...');
      
      // Fallback to mock data
      await delay(1000);
      
      const existingUser = mockUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists with this email (Mock - Backend unavailable)'
        };
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user'
      };
      
      mockUsers.push(newUser);
      
      return {
        success: true,
        message: 'Registration successful! Please login. (Mock - Backend unavailable)'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
