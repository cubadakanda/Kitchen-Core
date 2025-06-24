// Test script untuk cek favoriteService dan menampilkan data favorit
// Copy & paste ini di browser console halaman Profile

const testFavorites = async () => {
  // Get import dari window scope
  const { favoriteService } = window.KitchenCore || {};
  
  if (!favoriteService) {
    console.error('❌ favoriteService tidak ditemukan di window.KitchenCore');
    console.log('Pastikan berada di halaman Profile dan favoriteService sudah diekspos');
    return;
  }

  console.log('==== 🔍 TEST FAVORITES DISPLAY ====');
  
  // Get user ID dari localStorage atau sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let userId;
  
  try {
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      userId = tokenData.id || tokenData.userId || 1;
      console.log('👤 User ID from token:', userId);
    } else {
      userId = 1; // Default untuk test
      console.log('⚠️ No token found, using default user ID:', userId);
    }
    
    // Test favoriteService
    console.log('🔄 Fetching favorites...');
    const favorites = await favoriteService.getUserFavorites(userId);
    console.log('📊 Total favorites:', favorites.length);
    
    if (favorites.length === 0) {
      console.log('ℹ️ No favorites found. Try adding some first.');
      return;
    }
    
    // Debug data structure
    console.log('📝 First favorite object:', favorites[0]);
    
    // Check data structure
    favorites.forEach((fav, index) => {
      console.log(`--- Favorite ${index + 1} ---`);
      console.log('Keys:', Object.keys(fav));
      
      if (fav.recipe) {
        console.log('✅ Has recipe data');
        console.log('Recipe ID:', fav.recipe.id);
        console.log('Recipe title:', fav.recipe.title || '(no title)');
        console.log('Recipe image_url:', fav.recipe.image_url || '(no image)');
      } else {
        console.log('❌ Missing recipe data');
        console.log('Raw data:', fav);
      }
      
      if (fav.recipe_id && !fav.recipe) {
        console.log('⚠️ Has recipe_id but no recipe object. This needs fixing.');
      }
    });
    
    // Check DOM for recipe display
    const recipeCards = document.querySelectorAll('.card-image img');
    console.log(`🖼️ Found ${recipeCards.length} recipe images in DOM`);
    
    if (recipeCards.length === 0) {
      console.log('❌ No recipe images found in DOM');
    } else {
      console.log('✅ Recipe images found in DOM');
      console.log('First image src:', recipeCards[0].src);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  console.log('==== TEST COMPLETE ====');
};

// Expose to browser
window.testFavorites = testFavorites;

// Auto-run in Node.js environment (when used with node test-favorites-display.js)
if (typeof window === 'undefined') {
  console.log('Run this script in browser console');
  console.log('1. Open Profile page');
  console.log('2. Open browser console (F12)');
  console.log('3. Copy & paste this entire script');
  console.log('4. Run: testFavorites()');
} else {
  console.log('Test script loaded. Run testFavorites() to execute test.');
}

// Usage instructions
console.log('Instructions:');
console.log('1. Ensure you are logged in');
console.log('2. Visit Profile page');
console.log('3. Run testFavorites() in console');
