// Test untuk verifikasi tampilan gambar setelah upload
// Buka di browser console saat di halaman Home

console.log('=== IMAGE DISPLAY TEST ===');

// Function untuk test display gambar
const testImageDisplay = () => {
    // Simulasi data recipe dengan uploaded image
    const testRecipe = {
        id: 999,
        title: 'Test Recipe',
        image_url: '/uploads/1734567890_abc123_test-image.jpg'
    };
    
    console.log('Testing image URL conversion...');
    console.log('Original image_url:', testRecipe.image_url);
    
    // Test konversi URL
    let imageUrl = testRecipe.image_url;
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        imageUrl = `http://localhost:5000${imageUrl}`;
    }
    
    console.log('Converted URL:', imageUrl);
    
    // Test apakah URL bisa diakses
    const img = new Image();
    img.onload = () => {
        console.log('✅ Image loaded successfully!');
        console.log('Image dimensions:', img.width, 'x', img.height);
    };
    img.onerror = () => {
        console.log('❌ Image failed to load');
        console.log('Check if backend is running and uploads folder exists');
    };
    img.src = imageUrl;
    
    return imageUrl;
};

// Test otomatis
window.testImageDisplay = testImageDisplay;
console.log('Run testImageDisplay() in console to test image URLs');
console.log('=== END IMAGE DISPLAY TEST ===');
