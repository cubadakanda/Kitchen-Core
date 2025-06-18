import db from './config/Database.js';

// Function to generate random Unsplash food image URL
const generateRandomFoodImage = () => {
  const imageIds = [
    'photo-1546069901-ba9599a7e63c', // food
    'photo-1512058564366-18510be2db19', // fried rice
    'photo-1621996346565-e3dbc353d2e5', // pasta
    'photo-1565299624946-b28f40a0ca4b', // pizza
    'photo-1567620905732-2d1ec7ab7445', // pancakes
    'photo-1574071318508-1cdbab80d002', // salad
    'photo-1563379091339-03246963d14a', // burger
    'photo-1565958011703-44f9829ba187', // soup
    'photo-1551782450-a2132b4ba21d', // pasta
    'photo-1598866594230-a7c12756260f' // curry
  ];
  
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
};

async function fixBlobUrls() {
  try {
    console.log('Checking for problematic image URLs...');
    
    // Find all recipes with blob URLs or problematic image URLs
    const [results] = await db.query(`
      SELECT id, title, image_url 
      FROM recipes 
      WHERE image_url LIKE 'blob:%' 
         OR image_url LIKE '%bulma%' 
         OR image_url LIKE '%placeholder%'
         OR image_url LIKE '%localhost%'
         OR image_url = ''
         OR image_url IS NULL
    `);
    
    console.log(`Found ${results.length} recipes with problematic URLs`);
    
    if (results.length === 0) {
      console.log('No problematic URLs found!');
      return;
    }
    
    // Update each recipe with a new Unsplash image
    for (const recipe of results) {
      const newImageUrl = generateRandomFoodImage();
      console.log(`Updating recipe ${recipe.id} (${recipe.title})`);
      console.log(`  Old URL: ${recipe.image_url}`);
      console.log(`  New URL: ${newImageUrl}`);
      
      await db.query('UPDATE recipes SET image_url = ? WHERE id = ?', [newImageUrl, recipe.id]);
      console.log(`✓ Updated recipe ${recipe.id}`);
    }
    
    console.log('\n✅ All recipes updated successfully!');
    
  } catch (error) {
    console.error('Error fixing blob URLs:', error);
  } finally {
    await db.close();
  }
}

fixBlobUrls();
