import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalCategories: 0,
    recentUsers: [],
    popularRecipes: []
  });

  const [loading, setLoading] = useState(true);

  // Simulate API fetch
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setTimeout(() => {
      setStats({
        totalRecipes: 253,
        totalUsers: 1427,
        totalCategories: 18,
        recentUsers: [
          { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-06-10' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-06-09' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', date: '2023-06-09' },
          { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', date: '2023-06-08' },
          { id: 5, name: 'Mike Brown', email: 'mike@example.com', date: '2023-06-07' }
        ],
        popularRecipes: [
          { id: 1, name: 'Spicy Thai Curry', views: 1250, rating: 4.8 },
          { id: 2, name: 'Homemade Pizza', views: 987, rating: 4.7 },
          { id: 3, name: 'Chocolate Chip Cookies', views: 845, rating: 4.9 },
          { id: 4, name: 'Beef Stroganoff', views: 721, rating: 4.5 },
          { id: 5, name: 'Vegetable Stir Fry', views: 650, rating: 4.6 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AdminLayout>
      <div>
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-3">Dashboard</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="buttons">
                <Link to="/admin/recipes/new" className="button is-primary">
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
        <div className="columns is-multiline">
          <div className="column is-4">
            <div className="stat-card">
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon">
                    <i className="fas fa-utensils"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value">{stats.totalRecipes}</div>
                  <div className="stat-card-title">Total Recipes</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="column is-4">
            <div className="stat-card">
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value">{stats.totalUsers}</div>
                  <div className="stat-card-title">Registered Users</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="column is-4">
            <div className="stat-card">
              <div className="columns is-mobile is-vcentered">
                <div className="column is-narrow">
                  <div className="stat-card-icon">
                    <i className="fas fa-tags"></i>
                  </div>
                </div>
                <div className="column">
                  <div className="stat-card-value">{stats.totalCategories}</div>
                  <div className="stat-card-title">Recipe Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users & Popular Recipes */}
        <div className="columns">
          <div className="column is-6">
            <div className="card admin-card">
              <header className="card-header admin-card-header">
                <p className="card-header-title">Recent Users</p>
                <Link to="/admin/users" className="card-header-icon" aria-label="View all users">
                  <span className="icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </Link>
              </header>
              <div className="card-content admin-card-content p-0">
                <table className="table is-fullwidth admin-table">
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
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="column is-6">
            <div className="card admin-card">
              <header className="card-header admin-card-header">
                <p className="card-header-title">Popular Recipes</p>
                <Link to="/admin/recipes" className="card-header-icon" aria-label="View all recipes">
                  <span className="icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </Link>
              </header>
              <div className="card-content admin-card-content p-0">
                <table className="table is-fullwidth admin-table">
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
                        <td>{recipe.name}</td>
                        <td>{recipe.views}</td>
                        <td>
                          <div className="has-text-warning">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="icon is-small">
                                <i className={`fas fa-star ${i < Math.floor(recipe.rating) ? '' : 'has-text-grey-lighter'}`}></i>
                              </span>
                            ))}
                            <span className="ml-1">{recipe.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
