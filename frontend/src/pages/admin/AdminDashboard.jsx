import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { recipeService } from '../../services/recipeService';
import { categoryService } from '../../services/categoryService';
import { getRatingStats, getAllRatings } from '../../services/ratingService';

const AdminDashboard = () => {  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalRatings: 0,
    averageRating: 0,
    recentUsers: [],
    popularRecipes: [],
    recentRatings: [],
    ratingDistribution: []
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
        console.log("Categories fetched:", categories);        // Fetch rating statistics
        let ratingStats = {};
        try {
          ratingStats = await getRatingStats();
          console.log("Rating stats fetched:", ratingStats);
        } catch (ratingError) {
          console.error("Failed to fetch rating stats:", ratingError);
          ratingStats = {
            totalRatings: 0,
            averageRating: '0.0',
            ratingDistribution: [],
            recentRatings: []
          };
        }

        // Make sure we have arrays to work with, falling back to empty arrays if not
        const recipeArray = Array.isArray(recipes) ? recipes : [];
        const userArray = Array.isArray(users) ? users : [];
        const categoryArray = Array.isArray(categories) ? categories : [];        // Sort recipes by rating first, then by rating count to get popular ones
        const sortedRecipes = [...recipeArray].sort((a, b) => {
          const ratingA = a.avg_rating || a.rating || 0;
          const ratingB = b.avg_rating || b.rating || 0;
          const countA = a.rating_count || 0;
          const countB = b.rating_count || 0;
          
          // First sort by rating, then by rating count
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return countB - countA;
        });

        // Sort users by created_at to get recent ones
        const sortedUsers = [...userArray].sort((a, b) => {
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          return dateB - dateA;
        });        // Set the data
        setStats({
          totalRecipes: recipeArray.length,
          totalUsers: userArray.length,
          totalCategories: categoryArray.length,
          totalRatings: ratingStats.totalRatings || 0,
          averageRating: ratingStats.averageRating || 0,
          recentUsers: sortedUsers.slice(0, 5).map(user => ({
            id: user.id,
            name: user.name || 'Unknown User',
            email: user.email || 'No Email',
            date: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Unknown Date'
          })),          popularRecipes: sortedRecipes.slice(0, 5).map(recipe => ({
            id: recipe.id,
            name: recipe.title || 'Unnamed Recipe',
            rating_count: recipe.rating_count || 0,
            rating: recipe.avg_rating || recipe.rating || 0
          })),
          recentRatings: ratingStats.recentRatings || [],
          ratingDistribution: ratingStats.ratingDistribution || []
        });

        console.log("Dashboard data processed successfully");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);        // Fallback to mock data if API calls fail
        setStats({
          totalRecipes: 3,
          totalUsers: 5,
          totalCategories: 2,
          totalRatings: 12,
          averageRating: 4.5,
          recentUsers: [
            { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-06-10' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-06-09' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', date: '2023-06-09' },
            { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', date: '2023-06-08' },
            { id: 5, name: 'Mike Brown', email: 'mike@example.com', date: '2023-06-07' }
          ],          popularRecipes: [
            { id: 1, name: 'Nasi Goreng Spesial', rating_count: 25, rating: 4.8 },
            { id: 2, name: 'Spaghetti Carbonara', rating_count: 18, rating: 4.7 },
            { id: 3, name: 'Rendang Daging', rating_count: 32, rating: 4.9 }
          ],          recentRatings: [
            { 
              id: 1, 
              rating: 5, 
              review_text: 'Excellent recipe!',
              User: { name: 'John Doe', email: 'john@example.com' }, 
              Recipe: { title: 'Nasi Goreng Spesial' }, 
              created_at: '2024-01-15T10:30:00Z' 
            },
            { 
              id: 2, 
              rating: 4, 
              review_text: 'Very good, will make again',
              User: { name: 'Jane Smith', email: 'jane@example.com' }, 
              Recipe: { title: 'Spaghetti Carbonara' }, 
              created_at: '2024-01-16T14:20:00Z' 
            },
            { 
              id: 3, 
              rating: 5, 
              review_text: 'Perfect authentic taste',
              User: { name: 'Bob Johnson', email: 'bob@example.com' }, 
              Recipe: { title: 'Rendang Daging' }, 
              created_at: '2024-01-17T19:45:00Z' 
            }
          ],
          ratingDistribution: [
            { rating: 1, count: 1 },
            { rating: 2, count: 0 },
            { rating: 3, count: 2 },
            { rating: 4, count: 4 },
            { rating: 5, count: 5 }
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
        </div>        {/* Stats Cards */}
        <div className="columns is-multiline">          <div className="column is-3">
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
          
          <div className="column is-3">
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
          
          <div className="column is-3">
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
            <div className="column is-3">
            <div className="box stat-card" style={{ 
              borderTop: '4px solid #e74c3c', 
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
                  <div className="stat-card-icon" style={{ backgroundColor: '#fdf2f2', color: '#e74c3c', padding: '16px', borderRadius: '50%' }}>
                    <i className="fas fa-star fa-lg"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.totalRatings}</div>
                  <div className="stat-card-title" style={{ color: '#666' }}>Total Ratings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row of stats */}
        <div className="columns is-multiline">
          <div className="column is-3">
            <div className="box stat-card" style={{ 
              borderTop: '4px solid #28a745', 
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
                  <div className="stat-card-icon" style={{ backgroundColor: '#f0fff4', color: '#28a745', padding: '16px', borderRadius: '50%' }}>
                    <i className="fas fa-heart fa-lg"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                    {stats.averageRating}
                    <i className="fas fa-star" style={{ fontSize: '1rem', marginLeft: '5px' }}></i>
                  </div>
                  <div className="stat-card-title" style={{ color: '#666' }}>Average Rating</div>
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
                <table className="table is-fullwidth is-hoverable">                  <thead>
                    <tr>
                      <th>Recipe Name</th>
                      <th>Total Ratings</th>
                      <th>Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popularRecipes.map(recipe => (
                      <tr key={recipe.id}>
                        <td><strong>{recipe.name}</strong></td>
                        <td>
                          <span className="tag is-info">
                            <i className="fas fa-star mr-1"></i> {recipe.rating_count} ratings
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
                    ))}                    {stats.popularRecipes.length === 0 && (
                      <tr>
                        <td colSpan="3" className="has-text-centered">No recipes found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>          </div>        </div>
        
        {/* Recent Ratings & Rating Distribution */}
        <div className="columns mt-5">
          <div className="column is-8">
            <div className="box" style={{ borderRadius: '6px', overflow: 'hidden' }}>              <header className="card-header" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '1rem' }}>
                <p className="card-header-title" style={{ color: 'white' }}>
                  <span className="icon mr-2">
                    <i className="fas fa-star"></i>
                  </span>
                  Recent Ratings & Reviews
                </p>
              </header>
              <div className="card-content p-0">
                <table className="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Recipe</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRatings.map((rating, index) => (
                      <tr key={rating.id || index}>
                        <td><strong>{rating.User?.name || 'Anonymous'}</strong></td>
                        <td>{rating.Recipe?.title || 'Unknown Recipe'}</td>
                        <td>
                          <div style={{ color: '#e74c3c' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="icon is-small">
                                <i className={`fas fa-star ${i < rating.rating ? '' : 'has-text-grey-lighter'}`}></i>
                              </span>
                            ))}
                            <span className="ml-1">{rating.rating}/5</span>
                          </div>
                        </td>
                        <td>{new Date(rating.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</td>
                      </tr>
                    ))}
                    {stats.recentRatings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="has-text-centered">No ratings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="column is-4">
            <div className="box" style={{ borderRadius: '6px', overflow: 'hidden' }}>
              <header className="card-header" style={{ backgroundColor: '#28a745', color: 'white', padding: '1rem' }}>
                <p className="card-header-title" style={{ color: 'white' }}>
                  <span className="icon mr-2">
                    <i className="fas fa-chart-bar"></i>
                  </span>
                  Rating Distribution
                </p>
              </header>
              <div className="card-content">
                {stats.ratingDistribution.map((dist, index) => (
                  <div key={index} className="mb-3">
                    <div className="level is-mobile mb-1">
                      <div className="level-left">
                        <div className="level-item">
                          <span>{dist.rating} Star{dist.rating > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="level-right">
                        <div className="level-item">
                          <span className="tag is-primary">{dist.count}</span>
                        </div>
                      </div>
                    </div>
                    <progress 
                      className="progress is-success is-small" 
                      value={dist.count} 
                      max={Math.max(...stats.ratingDistribution.map(d => d.count))}
                    ></progress>
                  </div>
                ))}
                {stats.ratingDistribution.length === 0 && (
                  <p className="has-text-centered">No rating data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
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
            </Link>
            <Link to="/admin/ratings" className="button" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
              <span className="icon mr-1"><i className="fas fa-star"></i></span>
              Manage Ratings
            </Link>
            <Link to="/admin/users/add" className="button primary-bg">
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
