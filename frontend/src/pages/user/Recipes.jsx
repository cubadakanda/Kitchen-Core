import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import RecipeCard from '../../components/user/RecipeCard';
import { useAuth } from '../../context/AuthContext';

const Recipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      // Fetch recipes with filters
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Fetch categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleFavorite = async (recipeId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    
    try {
      // Toggle favorite status
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <MainLayout user={user}>
      <div className="recipes-page">
        <div className="page-header">
          <h1>All Recipes</h1>
          <p>Discover delicious recipes from our community</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="recipes-content">
          {loading ? (
            <div className="loading">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="no-recipes">
              <p>No recipes found matching your criteria.</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onView={(id) => window.location.href = `/recipes/${id}`}
                  onFavorite={handleFavorite}
                  isFavorited={recipe.is_favorited}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Recipes;
