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
          const createdAt = new Date(u.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdAt >= thirtyDaysAgo;
        }).length;

        setStats({
          users: {
            total: users.length,
            new: newUsers,
            admins: admins,
            regularUsers: regularUsers
          },
          recipes: {
            total: recipes.length,
            popular: recipes.slice(0, 5),
            recent: recipes.slice(-5).reverse()
          },
          categories: {
            total: categories.length
          },
          activities: [
            { type: 'user', message: `${newUsers} new users registered this month`, time: '2 hours ago' },
            { type: 'recipe', message: `${recipes.length} recipes published`, time: '1 day ago' },
            { type: 'category', message: `${categories.length} categories available`, time: '3 days ago' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values on error
        setStats({
          users: { total: 0, new: 0, admins: 0, regularUsers: 0 },
          recipes: { total: 0, popular: [], recent: [] },
          categories: { total: 0 },
          activities: []
        });
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
  
  return (
    <AdminLayout>
      <div style={{ padding: '0' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: 0 }}>
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', opacity: 0.9 }}>
                Here's what's happening with your Kitchen Core platform today.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '1rem',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
                  {stats.users.total + stats.recipes.total}
                </div>
                <div style={{ opacity: 0.9 }}>Total Items</div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '16rem' 
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                animation: 'spin 1s linear infinite',
                borderRadius: '50%',
                height: '4rem',
                width: '4rem',
                borderTop: '4px solid #3B82F6',
                borderBottom: '4px solid #3B82F6',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'pulse 2s infinite',
                background: '#3B82F6',
                borderRadius: '50%',
                height: '1rem',
                width: '1rem'
              }}></div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Total Users Card */}
              <div style={{
                background: 'linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%)',
                border: '1px solid #BFDBFE',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                  }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>
                      {stats.users.total}
                    </div>
                    <div style={{ color: '#2563EB', fontWeight: '600' }}>Total Users</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{
                    color: '#059669',
                    fontWeight: '600',
                    background: '#D1FAE5',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    +{stats.users.new} new
                  </span>
                  <span style={{ color: '#6B7280' }}>this month</span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280' }}>
                  <span>Admins: {stats.users.admins}</span>
                  <span>Users: {stats.users.regularUsers}</span>
                </div>
              </div>

              {/* Total Recipes Card */}
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                border: '1px solid #BBF7D0',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                  }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>
                      {stats.recipes.total}
                    </div>
                    <div style={{ color: '#059669', fontWeight: '600' }}>Total Recipes</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => window.location.href = '/admin/recipes'}
                    style={{
                      width: '100%',
                      background: '#10B981',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#059669'}
                    onMouseOut={(e) => e.target.style.background = '#10B981'}
                  >
                    Manage Recipes
                  </button>
                </div>
              </div>

              {/* Total Categories Card */}
              <div style={{
                background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                border: '1px solid #DDD6FE',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)'
                  }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>
                      {stats.categories.total}
                    </div>
                    <div style={{ color: '#7C3AED', fontWeight: '600' }}>Categories</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => window.location.href = '/admin/categories'}
                    style={{
                      width: '100%',
                      background: '#8B5CF6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#7C3AED'}
                    onMouseOut={(e) => e.target.style.background = '#8B5CF6'}
                  >
                    Manage Categories
                  </button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1px solid #FDE68A',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)'
                  }}>
                    <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Quick</div>
                    <div style={{ color: '#D97706', fontWeight: '600' }}>Actions</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => window.location.href = '/admin/users'}
                    style={{
                      width: '100%',
                      background: '#F59E0B',
                      color: 'white',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#D97706'}
                    onMouseOut={(e) => e.target.style.background = '#F59E0B'}
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/recipes/new'}
                    style={{
                      width: '100%',
                      background: '#FBBF24',
                      color: 'white',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#F59E0B'}
                    onMouseOut={(e) => e.target.style.background = '#FBBF24'}
                  >
                    Add Recipe
                  </button>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '2rem'
            }}>
              {/* Popular Recipes */}
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '1.5rem',
                border: '1px solid #F3F4F6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Popular Recipes</h2>
                  <button style={{ color: '#3B82F6', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.recipes.popular.length > 0 ? (
                    stats.recipes.popular.map((recipe, index) => (
                      <div key={recipe.id || index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '0.75rem',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.125rem',
                          marginRight: '1rem',
                          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontWeight: '600', color: '#1F2937', margin: '0 0 0.25rem 0' }}>
                            {recipe.title || 'Recipe Title'}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>
                            {recipe.category?.name || 'Category'}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#FBBF24', marginRight: '1rem' }}>
                              <svg style={{ width: '1rem', height: '1rem', fill: 'currentColor' }} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem', fontWeight: '500', color: '#6B7280' }}>
                                {recipe.rating || '4.5'}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              background: '#E5E7EB',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px'
                            }}>
                              {recipe.difficulty || 'Medium'}
                            </span>
                          </div>
                        </div>
                        <button style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                      <svg style={{ width: '4rem', height: '4rem', color: '#D1D5DB', margin: '0 auto 1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p style={{ color: '#6B7280', fontSize: '1.125rem', margin: '0 0 1rem 0' }}>No recipes available</p>
                      <button style={{
                        background: '#3B82F6',
                        color: 'white',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}>
                        Add First Recipe
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '1.5rem',
                border: '1px solid #F3F4F6'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
                  Recent Activity
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.activities.map((activity, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: '#F9FAFB',
                      borderRadius: '0.75rem'
                    }}>
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: activity.type === 'user' ? '#DBEAFE' : activity.type === 'recipe' ? '#D1FAE5' : '#F3E8FF',
                        color: activity.type === 'user' ? '#2563EB' : activity.type === 'recipe' ? '#059669' : '#7C3AED'
                      }}>
                        {activity.type === 'user' ? (
                          <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : activity.type === 'recipe' ? (
                          <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                          </svg>
                        ) : (
                          <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500', margin: '0 0 0.25rem 0' }}>
                          {activity.message}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  background: '#F3F4F6',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  View All Activities
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '2fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
