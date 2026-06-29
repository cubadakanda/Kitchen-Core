// Debug.js - Component yang menampung utilitas debug untuk Kitchen Core
import { favoriteService } from './services/favoriteService';
import * as imageUtils from './utils/imageUtils';

// Ekspos services untuk debugging di console browser
const createDebugNamespace = () => {
  if (typeof window !== 'undefined') {
    // Buat namespace untuk debugging
    window.KitchenCore = window.KitchenCore || {};
      // Ekspos services
    window.KitchenCore.favoriteService = favoriteService;
    window.KitchenCore.imageUtils = imageUtils;
    
    // Debug helpers
    window.KitchenCore.debug = {
      // Test favorit untuk user tertentu
      testFavorites: async (userId = 1) => {
        console.log('🔍 Testing favorites for user:', userId);
        try {
          const favorites = await favoriteService.getUserFavorites(userId);
          console.log('Found favorites:', favorites.length);
          console.log('Favorites data:', favorites);
          return favorites;
        } catch (error) {
          console.error('Error testing favorites:', error);
          return null;
        }
      },
      
      // Dump favorit ke console
      dumpFavorites: async (userId = 1) => {
        try {
          const favorites = await favoriteService.getUserFavorites(userId);
          console.table(favorites.map(f => ({
            user_id: f.user_id,
            recipe_id: f.recipe_id,
            hasRecipeData: !!f.recipe,
            recipeTitle: f.recipe ? f.recipe.title : 'N/A',
            imageUrl: f.recipe ? f.recipe.image_url : 'N/A'
          })));
          return favorites;
        } catch (error) {
          console.error('Error dumping favorites:', error);
          return null;
        }
      },
      
      // Test image URL handling
      testImageUrl: (url) => {
        console.log('Testing image URL handling for:', url);
        
        // Coba import image utils jika tersedia
        if (window.KitchenCore.imageUtils) {
          const { getSafeImageUrl, isProblematicImageUrl } = window.KitchenCore.imageUtils;
          console.log('Is problematic?', isProblematicImageUrl(url));
          console.log('Safe URL:', getSafeImageUrl(url));
        } else {
          console.log('imageUtils not exposed to window.KitchenCore');
        }
        
        // Create test image
        const img = new Image();
        img.onload = () => console.log('✅ Image loads successfully');
        img.onerror = () => console.log('❌ Image failed to load');
        img.src = url;
        
        return url;
      }
    };
    
    console.log('🛠️ Kitchen Core debug utilities loaded in window.KitchenCore');
    console.log('Try: window.KitchenCore.debug.testFavorites()');
  }
};

// Initialize debug namespace
createDebugNamespace();

// No-op component that can be included in App.js
const Debug = () => null;

export default Debug;
