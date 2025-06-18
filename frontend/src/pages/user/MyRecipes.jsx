import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import LazyImage from '../../components/common/LazyImage';
import { recipeService } from '../../services/recipeService';
import '../../styles/bulma-home.css';

const MyRecipes = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMyRecipes();
  }, [user, navigate]);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      // Mock data for user recipes - in real app, filter by user_id
      const allRecipes = await recipeService.getAllRecipes();
      // Filter recipes by user (mock filtering)
      const userRecipes = allRecipes.filter(recipe => recipe.user_id === user.id);
      setMyRecipes(userRecipes);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      setDeleteLoading(recipeId);
      await recipeService.deleteRecipe(recipeId);
      setMyRecipes(myRecipes.filter(recipe => recipe.id !== recipeId));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="home-page">
        <Header user={null} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <h3 className="title is-4">Please Login</h3>
              <Link to="/auth" className="button is-primary">Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="home-page">
        <Header user={user} onLogout={handleLogout} />
        <div className="section">
          <div className="container">
            <div className="has-text-centered">
              <div className="loader is-loading"></div>
              <p className="mt-4">Loading your recipes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <section className="hero is-small" style={{
        background: `linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)`,
        color: 'var(--text-on-primary)'
      }}>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column">
                <h1 className="title is-2 has-text-white">
                  <i className="fas fa-book mr-3"></i>
                  My Recipes
                </h1>
                <p className="subtitle is-5 has-text-white-ter">
                  Manage your personal recipe collection
                </p>
              </div>
              <div className="column is-narrow">
                <Link to="/my-recipes/create" className="button is-success is-medium">
                  <i className="fas fa-plus mr-2"></i>
                  Create New Recipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="section">
        <div className="container">
          {myRecipes.length === 0 ? (
            <div className="has-text-centered py-6">
              <i className="fas fa-book-open fa-3x has-text-grey-light mb-4"></i>
              <h3 className="title is-4 has-text-grey">No recipes yet</h3>
              <p className="has-text-grey mb-4">Start creating your own recipes to share with the community!</p>
              <Link to="/my-recipes/create" className="button is-primary is-large">
                <i className="fas fa-plus mr-2"></i>
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="columns is-multiline">
              {myRecipes.map(recipe => (
                <div key={recipe.id} className="column is-4-desktop is-6-tablet is-12-mobile">
                  <div className="card">
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <LazyImage 
                          src={recipe.image_url} 
                          alt={recipe.title}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          fallbackSrc="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"                        />
                      </figure>
                      <div className="recipe-status-badge" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span className={`tag ${recipe.status === 'published' ? 'is-success' : 'is-warning'}`}>
                          {recipe.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="media">
                        <div className="media-content">
                          <p className="title is-5">{recipe.title}</p>
                          <p className="subtitle is-6 has-text-grey">
                            {recipe.category ? recipe.category.name : 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                      <div className="content">
                        <p className="is-size-7 has-text-grey-dark">
                          {recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}
                        </p>
                      </div>
                    </div>
                    <footer className="card-footer">
                      <Link 
                        to={`/recipes/${recipe.id}`} 
                        className="card-footer-item has-text-info"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        View
                      </Link>
                      <Link 
                        to={`/my-recipes/edit/${recipe.id}`} 
                        className="card-footer-item has-text-primary"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                      </Link>
                      <button 
                        className="card-footer-item has-text-danger"
                        style={{ border: 'none', background: 'none' }}
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        disabled={deleteLoading === recipe.id}
                      >
                        {deleteLoading === recipe.id ? (
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                        ) : (
                          <i className="fas fa-trash mr-2"></i>
                        )}
                        Delete
                      </button>
                    </footer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyRecipes;
