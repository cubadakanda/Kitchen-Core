import { useState, useEffect, useCallback } from 'react';

// Global cache to prevent duplicate API calls
let recipesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchRecipes = useCallback(async (forceRefresh = false) => {
    try {
      // Check if we have valid cached data
      const now = Date.now();
      if (!forceRefresh && recipesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('Using cached recipes data');
        setRecipes(recipesCache);
        setLoading(false);
        return recipesCache;
      }
      
      setLoading(true);
      console.log('Fetching recipes from API...');
      const response = await fetch('http://localhost:5000/api/recipes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Recipes fetched successfully:', data);
      
      // Ensure category data is properly structured
      const processedData = data.map(recipe => ({
        ...recipe,
        category: recipe.category || { name: 'Uncategorized' },
        user: recipe.user || { name: 'Unknown Chef' },
        image_url: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        cooking_time: recipe.cooking_time || recipe.cook_time || recipe.prep_time || 30,
        calories: recipe.calories || 300
      }));
      
      // Cache the results
      recipesCache = processedData;
      cacheTimestamp = now;
      
      setRecipes(processedData);
      return processedData;
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      
      // Return mock data as fallback
      const mockRecipes = [
        {
          id: 1,
          title: "Nasi Goreng Spesial",
          description: "Nasi goreng dengan bumbu rahasia yang lezat dan menggugah selera",
          image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 30,
          calories: 450,
          category: { id: 1, name: "Indonesian" },
          user: { id: 1, name: "Chef Andi" },
          ingredients: "2 piring nasi putih\n3 butir telur\n100g ayam fillet\n2 siung bawang putih\n3 siung bawang merah\nKecap manis secukupnya",
          instructions: "Panaskan minyak di wajan\nTumis bumbu hingga harum\nMasukkan telur, orak-arik\nTambahkan nasi dan aduk rata\nBeri kecap manis dan garam\nSajikan selagi hangat"
        },
        {
          id: 2,
          title: "Spaghetti Carbonara",
          description: "Pasta Italia klasik dengan saus creamy yang lezat dan autentik",
          image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 25,
          calories: 520,
          category: { id: 2, name: "Italian" },
          user: { id: 2, name: "Chef Mario" },
          ingredients: "400g spaghetti\n200g pancetta\n4 butir telur\n100g keju parmesan\nLada hitam secukupnya",
          instructions: "Rebus spaghetti hingga al dente\nGoreng pancetta hingga crispy\nKocok telur dengan keju\nCampur pasta dengan pancetta\nTambahkan campuran telur\nSajikan dengan lada hitam"
        },
        {
          id: 3,
          title: "Chicken Teriyaki",
          description: "Ayam dengan saus teriyaki yang manis gurih ala Jepang yang autentik",
          image_url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 35,
          calories: 380,
          category: { id: 3, name: "Japanese" },
          user: { id: 3, name: "Chef Tanaka" },
          ingredients: "500g ayam fillet\n3 sdm kecap asin\n2 sdm mirin\n2 sdm sake\n1 sdm gula\n1 sdt jahe parut",
          instructions: "Potong ayam sesuai selera\nMarinasi dengan bumbu\nPanaskan wajan anti lengket\nMasak ayam hingga matang\nTuang sisa marinade\nMasak hingga saus mengental"
        },
        {
          id: 4,
          title: "Tom Yum Goong",
          description: "Sup asam pedas khas Thailand dengan udang segar yang menggugah selera",
          image_url: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 20,
          calories: 180,
          category: { id: 4, name: "Thai" },
          user: { id: 4, name: "Chef Siriporn" },
          ingredients: "300g udang segar\n3 batang serai\n5 lembar daun jeruk\n3 buah cabe rawit\n2 sdm air jeruk nipis\nJamur shimeji secukupnya",
          instructions: "Rebus air dengan serai dan daun jeruk\nMasukkan udang dan jamur\nTambahkan cabe rawit\nBeri bumbu tom yum\nFinishing dengan air jeruk nipis\nSajikan hangat dengan nasi"
        },
        {
          id: 5,
          title: "Beef Rendang",
          description: "Daging sapi yang dimasak dengan bumbu rempah khas Minang yang kaya rasa",
          image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 180,
          calories: 380,
          category: { id: 1, name: "Indonesian" },
          user: { id: 5, name: "Chef Sari" },
          ingredients: "1kg daging sapi\n500ml santan kental\n10 siung bawang merah\n6 siung bawang putih\n5cm jahe\n3cm lengkuas\nDaun jeruk secukupnya",
          instructions: "Haluskan semua bumbu\nTumis bumbu hingga harum\nMasukkan daging, aduk rata\nTuang santan sedikit demi sedikit\nMasak dengan api kecil\nAduk terus hingga bumbu meresap dan mengering"
        },
        {
          id: 6,
          title: "Chicken Tikka Masala",
          description: "Ayam panggang dengan saus tomat krim yang creamy ala India",
          image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          cooking_time: 45,
          calories: 420,
          category: { id: 5, name: "Indian" },
          user: { id: 6, name: "Chef Raj" },
          ingredients: "600g ayam fillet\n200ml yogurt\n400ml saus tomat\n200ml krim masak\n2 sdt garam masala\n1 sdt kunyit",
          instructions: "Marinasi ayam dengan yogurt dan rempah\nPanggang ayam hingga matang\nTumis bawang dan rempah\nTambahkan saus tomat\nMasukkan krim dan ayam\nSimmer hingga saus mengental"        }
      ];
      
      // Cache the fallback data too
      recipesCache = mockRecipes;
      cacheTimestamp = Date.now();
      
      setRecipes(mockRecipes);
      return mockRecipes;
    } finally {
      setLoading(false);
    }
  }, []); // useCallback dependency array
  
  // Function to invalidate cache (useful after creating/updating recipes)
  const invalidateCache = useCallback(() => {
    recipesCache = null;
    cacheTimestamp = null;
    console.log('Recipe cache invalidated');
  }, []);
  
  // Function to refresh recipes from API
  const refreshRecipes = useCallback(() => {
    return fetchRecipes(true); // Force refresh
  }, [fetchRecipes]);
  
  useEffect(() => {
    // Only fetch if we don't have cached data or it's expired
    const now = Date.now();
    if (!recipesCache || !cacheTimestamp || (now - cacheTimestamp >= CACHE_DURATION)) {
      fetchRecipes();
    } else {
      console.log('Using cached recipes on mount');
      setRecipes(recipesCache);
      setLoading(false);
    }
  }, [fetchRecipes]);

  return { 
    recipes, 
    loading, 
    error, 
    fetchRecipes, 
    refreshRecipes,
    invalidateCache,
    refetch: fetchRecipes 
  };
};

export default useRecipes;
