// Image utility functions for consistent image handling across the app

// Function to generate random Unsplash food image URL
export const generateRandomFoodImage = (width = 1000, height = 600) => {
  const imageIds = [
    'photo-1546069901-ba9599a7e63c', // food spread
    'photo-1512058564366-18510be2db19', // fried rice
    'photo-1621996346565-e3dbc353d2e5', // pasta
    'photo-1565299624946-b28f40a0ca4b', // pizza
    'photo-1567620905732-2d1ec7ab7445', // pancakes
    'photo-1574071318508-1cdbab80d002', // salad
    'photo-1563379091339-03246963d14a', // burger
    'photo-1565958011703-44f9829ba187', // soup
    'photo-1551782450-a2132b4ba21d', // pasta dish
    'photo-1598866594230-a7c12756260f', // curry
    'photo-1604908176997-125f25cc6f3d', // beef dish
    'photo-1565557623262-b51c2513a641', // chicken tikka
    'photo-1555939594-58d7cb561ad1' // stir fry
  ];
  
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${width}&q=80`;
};

// Default fallback image (consistent across app)
export const getDefaultFoodImage = (width = 1000, height = 600) => {
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${width}&q=80`;
};

// Function to check if an image URL is problematic (blob, CORS-blocked, etc.)
export const isProblematicImageUrl = (url) => {
  if (!url || url === '') return true;
  if (url.startsWith('blob:')) return true;
  if (url.includes('bulma.io')) return true;
  if (url.includes('placeholder')) return true;
  
  // Allow our uploaded images from localhost:5000/uploads
  if (url.startsWith('http://localhost:5000/uploads/')) return false;
  
  // Block other localhost URLs that are not our uploads or unsplash
  if (url.startsWith('http://localhost') && !url.includes('unsplash') && !url.includes('/uploads/')) return true;
  
  return false;
};

// Function to get a safe image URL (replace problematic URLs with working ones)
export const getSafeImageUrl = (url, width = 1000, height = 600) => {
  console.log('=== getSafeImageUrl DEBUG ===');
  console.log('Input URL:', url);
  console.log('Is problematic:', isProblematicImageUrl(url));
  
  if (isProblematicImageUrl(url)) {
    const fallback = getDefaultFoodImage(width, height);
    console.log('Using fallback image:', fallback);
    console.log('=== END getSafeImageUrl DEBUG ===');
    return fallback;
  }
  
  // If it's one of our uploaded images, make sure it has the full URL
  const fullUrl = getFullImageUrl(url);
  const finalUrl = fullUrl || url;
  console.log('Final URL:', finalUrl);
  console.log('=== END getSafeImageUrl DEBUG ===');
  return finalUrl;
};

// Function to handle image error events
export const handleImageError = (event, fallbackWidth = 1000, fallbackHeight = 600) => {
  console.warn('Image failed to load:', event.target.src);
  event.target.src = getDefaultFoodImage(fallbackWidth, fallbackHeight);
};

// Function to simulate file upload by converting file to base64
export const simulateImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Create FileReader to convert file to base64
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64Data = e.target.result;
      console.log('📸 Image converted to base64');
      console.log('📁 Original file:', file.name);
      console.log('📏 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      resolve({
        success: true,
        url: base64Data, // Return base64 data URL
        originalFile: file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        message: 'Image processed successfully'
      });
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(new Error('Failed to read file'));
    };
    
    // Convert file to base64 data URL
    reader.readAsDataURL(file);
  });
};

// Function to create object URL for immediate preview
export const createImagePreview = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

// Function to revoke object URL to prevent memory leaks
export const revokeImagePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Function to get full image URL
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, it's our uploaded image
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  // If it starts with uploads/ (without leading slash)
  if (imagePath.startsWith('uploads/')) {
    return `http://localhost:5000/${imagePath}`;
  }
  
  // Default fallback
  return `http://localhost:5000/uploads/${imagePath}`;
};
