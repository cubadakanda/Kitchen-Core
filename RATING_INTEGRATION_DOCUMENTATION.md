# Rating Integration in Admin Dashboard

## Perubahan yang Dibuat

### 1. Backend - Rating Controller (`recipe_ratingsControllers.js`)
- **`getRecipeRatings()`**: Menambahkan include untuk User dan Recipe associations
- **`getRatingStats()`**: Fungsi baru untuk mendapatkan statistik rating
  - Total ratings count
  - Average rating
  - Rating distribution (1-5 stars)
  - Recent ratings dengan informasi user dan recipe
  - Error handling yang lebih baik dengan logging

### 2. Backend - Recipe Controller (`recipesControllers.js`)
- **`getRecipes()`**: Menambahkan perhitungan average rating untuk setiap recipe
- Menambahkan `avg_rating` dan `rating_count` ke response
- Import RecipeRatingModel untuk akses data rating

### 3. Backend - Routes (`recipeRatingRoutes.js`)
- Menambahkan route `/ratings/stats` untuk admin dashboard
- Import dan export fungsi `getRatingStats`

### 4. Frontend - Rating Service (`ratingService.js`)
- **`getAllRatings()`**: Mendapatkan semua ratings untuk admin
- **`getRatingStats()`**: Mendapatkan statistik rating untuk dashboard

### 5. Frontend - Admin Dashboard (`AdminDashboard.jsx`)
- **New Stats Cards**: 
  - Total Ratings card dengan icon star
  - Average Rating card dengan icon heart
- **Enhanced Popular Recipes Table**:
  - Menambahkan kolom "Reviews" untuk menampilkan jumlah review
  - Sorting berdasarkan rating terlebih dahulu, kemudian views
  - Menampilkan rating count
- **New Section - Recent Ratings & Reviews**:
  - Table menampilkan user, recipe, rating, dan tanggal
  - Rating Distribution chart dengan progress bars
- **Better Error Handling**:
  - Try-catch terpisah untuk rating stats
  - Fallback data yang lebih realistic

### 6. Frontend - New Admin Page (`ManageRatings.jsx`)
- Halaman baru untuk manage ratings
- Table dengan informasi lengkap rating
- Delete functionality dengan confirmation modal
- Star rating display
- Responsive design dengan Bulma CSS

### 7. Frontend - Navigation Updates
- **App.js**: Menambahkan route `/admin/ratings`
- **AdminSidebar.jsx**: Menambahkan menu "Ratings" dengan icon star
- **AdminDashboard.jsx**: Menambahkan "Manage Ratings" di Quick Actions

## Features Dashboard Rating

### Stats Cards
1. **Total Ratings**: Menampilkan jumlah total rating
2. **Average Rating**: Menampilkan rata-rata rating dengan icon star

### Popular Recipes (Enhanced)
- Sorting berdasarkan rating tertinggi
- Menampilkan views, rating bintang, dan jumlah reviews
- Link ke manage recipes

### Recent Ratings & Reviews
- Table dengan 10 rating terbaru
- Informasi user yang memberikan rating
- Recipe yang dirating
- Star rating display
- Tanggal rating

### Rating Distribution
- Chart menampilkan distribusi rating 1-5 bintang
- Progress bar untuk visualisasi
- Jumlah count untuk setiap level rating

### Quick Actions
- Tombol "Manage Ratings" untuk akses langsung ke halaman manage ratings

## API Endpoints Rating

### GET `/api/ratings`
- Mendapatkan semua ratings dengan user dan recipe info
- Include associations untuk User dan Recipe

### GET `/api/ratings/stats`
- Mendapatkan statistik rating untuk dashboard
- Return: totalRatings, averageRating, ratingDistribution, recentRatings

### DELETE `/api/ratings/:id`
- Menghapus rating berdasarkan ID
- Untuk admin management

## Troubleshooting

### Jika "Anonymous" dan "Unknown Recipe" muncul:
1. Pastikan associations di model sudah benar
2. Check apakah foreign key user_id dan recipe_id ada di database
3. Pastikan data user dan recipe ada untuk rating yang dimaksud

### Jika rating tidak muncul di Popular Recipes:
1. Pastikan ada data rating di database
2. Check fungsi `getRecipes()` di backend sudah include rating calculation
3. Verify frontend mapping menggunakan `avg_rating`

### Error Handling:
- Semua API calls memiliki try-catch dengan fallback data
- Console logging untuk debugging
- Error messages yang informatif
