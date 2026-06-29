// Debug script to test image loading and recipe data
import React from 'react';

const DebugComponent = () => {
  const testImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
  
  React.useEffect(() => {
    console.log('Testing image URL:', testImageUrl);
    
    // Test image loading
    const img = new Image();
    img.onload = () => console.log('✅ Image loaded successfully');
    img.onerror = () => console.log('❌ Image failed to load');
    img.src = testImageUrl;
    
    // Test API connection
    fetch('http://localhost:5000/api/recipes')
      .then(response => {
        console.log('API Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('✅ API data received:', data.length, 'recipes');
        data.forEach((recipe, index) => {
          console.log(`Recipe ${index + 1}:`, {
            id: recipe.id,
            title: recipe.title,
            category: recipe.category?.name || 'No category',
            image_url: recipe.image_url || 'No image',
            cooking_time: recipe.cooking_time || recipe.cook_time || 'No time'
          });
        });
      })
      .catch(error => {
        console.log('❌ API connection failed:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Debug Component</h2>
      <p>Check console for debug information</p>
      <img 
        src={testImageUrl} 
        alt="Test image" 
        style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        onLoad={() => console.log('Image rendered successfully')}
        onError={() => console.log('Image render failed')}
      />
    </div>
  );
};

export default DebugComponent;
