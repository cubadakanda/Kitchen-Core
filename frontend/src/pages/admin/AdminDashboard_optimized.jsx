import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { recipeService } from '../../services/recipeService';
import { categoryService } from '../../services/categoryService';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, new: 0, admins: 0, regularUsers: 0 },
    recipes: { total: 0, popular: [], recent: [] },
    categories: { total: 0 },
    activities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Fetch users count
        const usersResponse = await userService.getAllUsers();
        // Fetch recipes
        const recipesResponse = await recipeService.getAllRecipes();
        // Fetch categories
        const categoriesResponse = await categoryService.getAllCategories();

        const users = Array.isArray(usersResponse) ? usersResponse : [];
        const recipes = Array.isArray(recipesResponse) ? recipesResponse : [];
        const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];

        // Calculate user statistics
        const admins = users.filter(u => u.role === 'admin').length;
        const regularUsers = users.filter(u => u.role === 'user').length;
        const newUsers = users.filter(u => {
          if (!u.createdAt) return false;
          const userDate = new Date(u.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return userDate >= weekAgo;
        }).length;

        // Sort recipes by ratings/popularity
        const sortedRecipes = recipes.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        const popularRecipes = sortedRecipes.slice(0, 5);
        const recentRecipes = recipes.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

        setStats({
          users: {
            total: users.length,
            new: newUsers,
            admins,
            regularUsers
          },
          recipes: {
            total: recipes.length,
            popular: popularRecipes,
            recent: recentRecipes
          },
          categories: {
            total: categories.length
          },
          activities: [
            { type: 'user', message: `${newUsers} new users this week`, time: 'This week' },
            { type: 'recipe', message: `${recipes.length} total recipes`, time: 'All time' },
            { type: 'category', message: `${categories.length} categories available`, time: 'Current' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user]);

  // Redirect if not admin
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
              <p className="text-purple-100 text-lg mb-4">
                Here's what's happening with your Kitchen Core platform today.
              </p>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.users.total + stats.recipes.total}</div>
              <div className="text-white/90">Total Items</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.users.total}</div>
            </div>
            <div className="text-blue-600 font-semibold">Total Users</div>
            <div className="text-sm text-gray-600 mt-2">
              {stats.users.new} new this week
            </div>
          </div>

          {/* Total Recipes Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.recipes.total}</div>
            </div>
            <div className="text-green-600 font-semibold">Total Recipes</div>
            <div className="text-sm text-gray-600 mt-2">
              {stats.recipes.popular.length} popular recipes
            </div>
          </div>

          {/* Total Categories Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.categories.total}</div>
            </div>
            <div className="text-purple-600 font-semibold">Categories</div>
            <div className="text-sm text-gray-600 mt-2">
              Recipe categories
            </div>
          </div>

          {/* Admin Users Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.users.admins}</div>
            </div>
            <div className="text-orange-600 font-semibold">Admin Users</div>
            <div className="text-sm text-gray-600 mt-2">
              {stats.users.regularUsers} regular users
            </div>
          </div>
        </div>

        {/* Recent Activities and Popular Recipes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {stats.activities.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'recipe' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {activity.type === 'user' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      ) : activity.type === 'recipe' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800 font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Recipes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Recipes</h3>
            <div className="space-y-4">
              {stats.recipes.popular.length > 0 ? (
                stats.recipes.popular.map((recipe, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                      {recipe.title?.charAt(0).toUpperCase() || 'R'}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{recipe.title}</h4>
                      <p className="text-sm text-gray-600">
                        Rating: {recipe.average_rating?.toFixed(1) || 'N/A'} ⭐
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recipes available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
