import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { recipeService } from '../../services/recipeService';
import { categoryService } from '../../services/categoryService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalCategories: 0,
    recentUsers: [],
    popularRecipes: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log("Fetching dashboard data...");
        
        // Try to fetch real data first
        const recipes = await recipeService.getAllRecipes();
        console.log("Recipes fetched:", recipes);
        
        const users = await userService.getAllUsers();
        console.log("Users fetched:", users);
        
        const categories = await categoryService.getAllCategories();
        console.log("Categories fetched:", categories);

        // Make sure we have arrays to work with, falling back to empty arrays if not
        const recipeArray = Array.isArray(recipes) ? recipes : [];
        const userArray = Array.isArray(users) ? users : [];
        const categoryArray = Array.isArray(categories) ? categories : [];

        // Sort recipes by views or ratings to get popular ones
        const sortedRecipes = [...recipeArray].sort((a, b) => 
          ((b.view_count || 0) - (a.view_count || 0))
        );

        // Sort users by created_at to get recent ones
        const sortedUsers = [...userArray].sort((a, b) => {
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          return dateB - dateA;
        });

        // Set the data
        setStats({
          totalRecipes: recipeArray.length,
          totalUsers: userArray.length,
          totalCategories: categoryArray.length,
          recentUsers: sortedUsers.slice(0, 5).map(user => ({
            id: user.id,
            name: user.name || 'Unknown User',
            email: user.email || 'No Email',
            date: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Unknown Date'
          })),
          popularRecipes: sortedRecipes.slice(0, 5).map(recipe => ({
            id: recipe.id,
            name: recipe.title || 'Unnamed Recipe',
            views: recipe.view_count || 0,
            rating: recipe.avg_rating || recipe.rating || 0
          }))
        });

        console.log("Dashboard data processed successfully");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to mock data if API calls fail
        setStats({
          totalRecipes: 3,
          totalUsers: 5,
          totalCategories: 2,
          recentUsers: [
            { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-06-10' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-06-09' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', date: '2023-06-09' },
            { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', date: '2023-06-08' },
            { id: 5, name: 'Mike Brown', email: 'mike@example.com', date: '2023-06-07' }
          ],
          popularRecipes: [
            { id: 1, name: 'Nasi Goreng Spesial', views: 120, rating: 4.8 },
            { id: 2, name: 'Spaghetti Carbonara', views: 98, rating: 4.7 },
            { id: 3, name: 'Rendang Daging', views: 85, rating: 4.9 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <AdminLayout>
      <div>
        <div className="level mb-5">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-3 primary-color">Dashboard Overview</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="buttons">
                <Link to="/admin/recipes/add" className="button primary-bg">
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>New Recipe</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="columns is-multiline">          <div className="column is-4">
            <div className="box stat-card" style={{ 
              borderTop: '4px solid var(--primary-color)', 
              borderRadius: '6px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 3px rgba(10,10,10,.1)';
            }}>
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', padding: '16px', borderRadius: '50%' }}>
                    <i className="fas fa-utensils fa-lg"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalRecipes}</div>
                  <div className="stat-card-title" style={{ color: '#666' }}>Total Recipes</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="column is-4">
            <div className="box stat-card" style={{ 
              borderTop: '4px solid var(--primary-color)', 
              borderRadius: '6px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 3px rgba(10,10,10,.1)';
            }}>
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', padding: '16px', borderRadius: '50%' }}>
                    <i className="fas fa-users fa-lg"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalUsers}</div>
                  <div className="stat-card-title" style={{ color: '#666' }}>Registered Users</div>
                </div>
              </div>
            </div>
          </div>
            <div className="column is-4">
            <div className="box stat-card" style={{ borderTop: '4px solid var(--primary-color)', borderRadius: '6px' }}>
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', padding: '16px', borderRadius: '50%' }}>
                    <i className="fas fa-tags fa-lg"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalCategories}</div>
                  <div className="stat-card-title" style={{ color: '#666' }}>Recipe Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users & Popular Recipes */}
        <div className="columns mt-5">
          <div className="column is-6">
            <div className="box" style={{ borderRadius: '6px', overflow: 'hidden' }}>
              <header className="card-header" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '1rem' }}>
                <p className="card-header-title" style={{ color: 'var(--secondary-color)' }}>
                  <span className="icon mr-2">
                    <i className="fas fa-user-plus"></i>
                  </span>
                  Recent Users
                </p>
                <Link to="/admin/users" className="card-header-icon" aria-label="View all users" style={{ color: 'var(--secondary-color)' }}>
                  <span className="icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </Link>
              </header>
              <div className="card-content p-0">
                <table className="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td>{user.date}</td>
                      </tr>
                    ))}
                    {stats.recentUsers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="has-text-centered">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            <div className="column is-6">
            <div className="box" style={{ borderRadius: '6px', overflow: 'hidden' }}>
              <header className="card-header" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '1rem' }}>
                <p className="card-header-title" style={{ color: 'var(--secondary-color)' }}>
                  <span className="icon mr-2">
                    <i className="fas fa-fire"></i>
                  </span>
                  Popular Recipes
                </p>
                <Link to="/admin/recipes" className="card-header-icon" aria-label="View all recipes" style={{ color: 'var(--secondary-color)' }}>
                  <span className="icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </Link>
              </header>
              <div className="card-content p-0">
                <table className="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>Recipe Name</th>
                      <th>Views</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popularRecipes.map(recipe => (
                      <tr key={recipe.id}>
                        <td><strong>{recipe.name}</strong></td>
                        <td>                          <span className="tag secondary-bg">
                            <i className="fas fa-eye mr-1"></i> {recipe.views}
                          </span>
                        </td>
                        <td>
                          <div style={{ color: 'var(--primary-color)' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="icon is-small">
                                <i className={`fas fa-star ${i < Math.floor(recipe.rating) ? '' : 'has-text-grey-lighter'}`}></i>
                              </span>
                            ))}
                            <span className="ml-1">{recipe.rating.toFixed(1)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {stats.popularRecipes.length === 0 && (
                      <tr>
                        <td colSpan="3" className="has-text-centered">No recipes found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>        </div>
        
        {/* Quick Actions Section */}
        <div className="mt-6">
          <h3 className="title is-4 mb-4 primary-color">Quick Actions</h3>
          <div className="buttons">
            <Link to="/admin/recipes/add" className="button primary-bg">
              <span className="icon mr-1"><i className="fas fa-plus"></i></span>
              Add New Recipe
            </Link>
            <Link to="/admin/categories" className="button secondary-bg">
              <span className="icon mr-1"><i className="fas fa-tags"></i></span>
              Manage Categories
            </Link>            <Link to="/admin/users/add" className="button primary-bg">
              <span className="icon mr-1"><i className="fas fa-user-plus"></i></span>
              Add New User
            </Link>
          </div>
        </div>
        
        {loading && (
          <div className="has-text-centered my-6">
            <span className="icon is-large">
              <i className="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
            <p className="mt-3">Loading dashboard data...</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
