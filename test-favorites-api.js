// Test script untuk cek API favorites
// Jalankan dengan: node test-favorites-api.js

const testAPI = async () => {
  try {
    console.log('🔍 Testing Favorites API...\n');
    
    // Test 1: Check if backend is running
    console.log('1. Testing backend connection...');
    const healthResponse = await fetch('http://localhost:5000/api/test');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData.message);
    } else {
      console.log('❌ Backend not responding');
      return;
    }
    
    // Test 2: Test favorites endpoint
    console.log('\n2. Testing favorites endpoint...');
    const favoritesResponse = await fetch('http://localhost:5000/api/user-favorites/user/1');
    console.log('Response status:', favoritesResponse.status);
    
    if (favoritesResponse.ok) {
      const favoritesData = await favoritesResponse.json();
      console.log('✅ Favorites API working');
      console.log('📊 Number of favorites:', favoritesData.length);
        if (favoritesData.length > 0) {
        console.log('📝 Sample favorite:', JSON.stringify(favoritesData[0], null, 2));
        
        // Check data structure
        if (favoritesData[0].recipe) {
          console.log('✅ Recipe data found in response');
          console.log('Recipe ID:', favoritesData[0].recipe.id);
          console.log('Recipe title:', favoritesData[0].recipe.title);
          console.log('Recipe image_url:', favoritesData[0].recipe.image_url);
        } else {
          console.log('❌ Recipe data missing in favorite response');
          console.log('Response structure:', Object.keys(favoritesData[0]));
        }
      }
    } else {
      const errorText = await favoritesResponse.text();
      console.log('❌ Favorites API failed');
      console.log('Error:', errorText);
    }
    
    // Test 3: Test recipes endpoint
    console.log('\n3. Testing recipes endpoint...');
    const recipesResponse = await fetch('http://localhost:5000/api/recipes');
    if (recipesResponse.ok) {
      const recipesData = await recipesResponse.json();
      console.log('✅ Recipes API working');
      console.log('📊 Number of recipes:', recipesData.length);
    } else {
      console.log('❌ Recipes API failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. Backend is running on port 5000');
    console.log('2. Database is connected');
    console.log('3. Run: cd backend && npm start');
  }
};

// Run if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const { default: fetch } = await import('node-fetch');
  global.fetch = fetch;
  testAPI();
} else {
  // Browser environment
  console.log('Run this in browser console or copy to a .js file and run with Node.js');
}
