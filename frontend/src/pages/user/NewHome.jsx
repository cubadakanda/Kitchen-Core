import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import '../../styles/new-home.css';
import '../../styles/tailwind-utils.css'; // Import Tailwind utility classes
import useRecipes from '../../hooks/useRecipes';

const NewHome = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchRecipes } = useRecipes();
  const [activeTab, setActiveTab] = useState('ingredients');
  
  // Featured recipe for the details section
  const [featuredRecipe] = useState({
    id: 1,
    title: 'Creamy Garlic Pasta',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3',
    cookTime: '20 mins',
    difficulty: 'Easy',
    servings: 4,
    description: 'This creamy garlic pasta is the perfect quick and easy weeknight meal. With just a handful of ingredients, you can create a restaurant-quality dish at home in under 30 minutes.'
  });

  const [categories] = useState([
    { id: 1, name: 'All Recipes', icon: 'utensils', bgColor: 'bg-orange-100', textColor: 'text-orange-500' },
    { id: 2, name: 'Vegetarian', icon: 'leaf', bgColor: 'bg-green-100', textColor: 'text-green-500' },
    { id: 3, name: 'Chicken', icon: 'drumstick-bite', bgColor: 'bg-blue-100', textColor: 'text-primary' },
    { id: 4, name: 'Seafood', icon: 'fish', bgColor: 'bg-red-100', textColor: 'text-red-500' },
    { id: 5, name: 'Desserts', icon: 'ice-cream', bgColor: 'bg-purple-100', textColor: 'text-purple-500' },
    { id: 6, name: 'Breakfast', icon: 'mug-hot', bgColor: 'bg-yellow-100', textColor: 'text-yellow-500' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        // Get only the first 3 recipes for the featured section
        setRecipes(data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
        // Using sample recipes data if API fails
        setRecipes([
          {
            id: 1,
            title: 'Fresh Vegetable Salad',
            image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
            category_name: 'Vegetarian',
            cooking_time: '15',
            difficulty: 'Easy',
            description: 'A refreshing mix of seasonal vegetables with a light lemon dressing.',
            likes: 124
          },
          {
            id: 2,
            title: 'Classic Spaghetti Carbonara',
            image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
            category_name: 'Italian',
            cooking_time: '25',
            difficulty: 'Medium',
            description: 'Creamy pasta with crispy pancetta and a rich egg sauce.',
            likes: 89
          },
          {
            id: 3,
            title: 'Decadent Chocolate Cake',
            image_url: 'https://images.unsplash.com/photo-1565299624943-b82815f6459c',
            category_name: 'Dessert',
            cooking_time: '60',
            difficulty: 'Intermediate',
            description: 'Rich, moist chocolate cake with a silky chocolate ganache.',
            likes: 156
          },
        ]);
      }
    };

    loadRecipes();
  }, [fetchRecipes]);

  return (
    <div className="gradient-bg font-sans">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <section className="hero-pattern">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Discover Amazing Recipes</h2>
              <p className="text-lg text-gray-600 mb-6">Find and share everyday cooking inspiration. Browse recipes for all meals, easy dinners, dessert ideas, and more.</p>
              <div className="relative max-w-md">
                <input 
                  type="text" 
                  placeholder="Search for recipes..." 
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3" 
                alt="Delicious Food" 
                className="rounded-lg shadow-xl w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">Featured Recipes</h3>
          <Link to="/recipes" className="text-orange-500 hover:underline">View All</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image-container">
                  <img 
                    src={recipe.image_url || `https://images.unsplash.com/photo-${recipe.id === 1 ? '1512621776951-a57141f2eefd' : recipe.id === 2 ? '1559847844-5315695dadae' : '1565299624943-b82815f6459c'}`}
                    alt={recipe.title} 
                    className="recipe-image w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-semibold text-gray-800">{recipe.title}</h4>                    <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                      {recipe.category_name || 'Main Dish'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <i className="fas fa-clock mr-1"></i>
                      <span>{recipe.cooking_time || '30'} mins</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-utensils mr-1"></i>
                      <span>{recipe.difficulty || 'Easy'}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-heart mr-1 text-orange-500"></i>
                      <span>{recipe.likes || '100+'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recipe Detail Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="recipe-detail overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={featuredRecipe.image} 
                alt={featuredRecipe.title} 
                className="w-full h-full object-cover recipe-detail-image"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{featuredRecipe.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center"><i className="fas fa-clock mr-1"></i> {featuredRecipe.cookTime}</span>
                    <span className="flex items-center"><i className="fas fa-utensils mr-1"></i> {featuredRecipe.difficulty}</span>
                    <span className="flex items-center"><i className="fas fa-user-friends mr-1"></i> {featuredRecipe.servings} servings</span>
                  </div>
                </div>
                <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{featuredRecipe.description}</p>
              
              <div className="mb-6">
                <div className="flex space-x-4 border-b">
                  <button 
                    onClick={() => showTab('ingredients')}
                    className={`animated-tab px-4 py-2 font-medium ${activeTab === 'ingredients' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'}`}
                  >
                    Ingredients
                  </button>
                  <button 
                    onClick={() => showTab('instructions')} 
                    className={`animated-tab px-4 py-2 font-medium ${activeTab === 'instructions' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'}`}
                  >
                    Instructions
                  </button>
                  <button 
                    onClick={() => showTab('nutrition')} 
                    className={`animated-tab px-4 py-2 font-medium ${activeTab === 'nutrition' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'}`}
                  >
                    Nutrition
                  </button>
                </div>
                
                <div id="ingredients" className={activeTab === 'ingredients' ? 'py-4' : 'hidden py-4'}>
                  <h4 className="font-semibold text-gray-800 mb-3">For the pasta:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>8 oz fettuccine or linguine</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>3 tablespoons unsalted butter</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>4 cloves garlic, minced</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>1 cup heavy cream</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>1/2 cup grated Parmesan cheese</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="ingredient-checkbox mr-3 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span>Salt and pepper to taste</span>
                    </li>
                  </ul>
                </div>
                
                <div id="instructions" className={activeTab === 'instructions' ? 'py-4' : 'hidden py-4'}>
                  <ol className="space-y-4">
                    <li className="flex">
                      <span className="step-number">1</span>
                      <span className="ml-3">Bring a large pot of salted water to a boil. Cook pasta according to package instructions until al dente.</span>
                    </li>
                    <li className="flex">
                      <span className="step-number">2</span>
                      <span className="ml-3">While pasta cooks, melt butter in a large skillet over medium heat. Add garlic and sauté for 30 seconds.</span>
                    </li>
                    <li className="flex">
                      <span className="step-number">3</span>
                      <span className="ml-3">Pour in heavy cream and bring to a simmer. Cook for 2-3 minutes until slightly thickened.</span>
                    </li>
                    <li className="flex">
                      <span className="step-number">4</span>
                      <span className="ml-3">Stir in Parmesan cheese until melted. Season with salt and pepper to taste.</span>
                    </li>
                  </ol>
                </div>
                
                <div id="nutrition" className={activeTab === 'nutrition' ? 'py-4' : 'hidden py-4'}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Calories</p>
                      <p className="font-semibold">520 kcal</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Carbs</p>
                      <p className="font-semibold">45g</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Protein</p>
                      <p className="font-semibold">15g</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Fat</p>
                      <p className="font-semibold">32g</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center justify-center">
                  <i className="fas fa-print mr-2"></i> Print Recipe
                </button>
                <button className="flex-1 bg-white border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-50 flex items-center justify-center">
                  <i className="fas fa-share-alt mr-2"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link to={`/recipes?category=${category.id}`} key={category.id} className="category-card">
              <div className={`${category.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <i className={`fas fa-${category.icon} ${category.textColor} text-2xl`}></i>
              </div>
              <span className="font-medium text-gray-800">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Weekly Recipe Inspiration</h3>
            <p className="text-gray-600 mb-6">Sign up for our newsletter and receive new recipes straight to your inbox every week!</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHome;
