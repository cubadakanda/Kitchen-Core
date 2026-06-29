# Troubleshooting: Anonymous User & Unknown Recipe

## Masalah
Dashboard menampilkan "Anonymous" dan "Unknown Recipe" di Recent Ratings section.

## Penyebab Umum
1. **Database kosong** - Tidak ada data rating di database
2. **Foreign key tidak match** - user_id atau recipe_id di rating tidak cocok dengan id di table users/recipes
3. **Association tidak bekerja** - Sequelize include tidak berfungsi dengan benar
4. **Table structure berbeda** - Nama kolom atau table tidak sesuai dengan model

## Solusi yang Sudah Diterapkan

### 1. Backend Raw Query (RECOMMENDED)
```javascript
// Menggunakan raw SQL query untuk memastikan JOIN bekerja
const recentRatings = await db.query(`
    SELECT 
        rr.id,
        rr.rating,
        rr.review_text,
        rr.created_at,
        u.name as user_name,
        u.email as user_email,
        r.title as recipe_title,
        r.id as recipe_id
    FROM recipe_ratings rr
    LEFT JOIN users u ON rr.user_id = u.id
    LEFT JOIN recipes r ON rr.recipe_id = r.id
    ORDER BY rr.created_at DESC
    LIMIT 10
`, { type: db.QueryTypes.SELECT });
```

### 2. Data Transformation
```javascript
// Transform raw query result ke format yang diharapkan frontend
const formattedRecentRatings = recentRatings.map(rating => ({
    id: rating.id,
    rating: rating.rating,
    review_text: rating.review_text,
    created_at: rating.created_at,
    User: {
        name: rating.user_name,
        email: rating.user_email
    },
    Recipe: {
        title: rating.recipe_title,
        id: rating.recipe_id
    }
}));
```

### 3. Frontend Fallback Data
```javascript
// Data fallback yang lebih realistic dengan struktur yang benar
recentRatings: [
    { 
        id: 1, 
        rating: 5, 
        review_text: 'Excellent recipe!',
        User: { name: 'John Doe', email: 'john@example.com' }, 
        Recipe: { title: 'Nasi Goreng Spesial' }, 
        created_at: '2024-01-15T10:30:00Z' 
    }
]
```

## Langkah Debugging

### 1. Check Database
```sql
-- Lihat semua rating dengan join
SELECT 
    rr.id,
    rr.rating,
    rr.user_id,
    rr.recipe_id,
    u.name as user_name,
    r.title as recipe_title
FROM recipe_ratings rr
LEFT JOIN users u ON rr.user_id = u.id
LEFT JOIN recipes r ON rr.recipe_id = r.id;
```

### 2. Check API Response
- Buka browser dev tools
- Lihat Network tab saat load dashboard
- Check response dari `/api/ratings/stats`
- Pastikan data User dan Recipe tidak null

### 3. Check Console Logs
Backend controller sudah ditambahkan logging:
```javascript
console.log('Recent ratings raw query result:', recentRatings);
```

## Testing Manual

### 1. Insert Sample Data
Jalankan file `sample_ratings_data.sql` di database untuk menambah data testing.

### 2. Test API Endpoints
Gunakan file `test-ratings.rest` untuk test endpoint:
- GET `/api/ratings/stats`
- GET `/api/ratings`

### 3. Verify Frontend
- Reload dashboard admin
- Check apakah Recent Ratings menampilkan data yang benar
- Verify console logs di browser

## Hasil Perubahan

### Popular Recipes Table
- **Sebelum**: Recipe Name | Views | Rating | Reviews
- **Sesudah**: Recipe Name | Total Ratings | Average Rating

Sekarang fokus pada jumlah rating daripada views, karena lebih relevan untuk popularitas berdasarkan feedback user.

### Recent Ratings
- Menggunakan raw SQL query untuk memastikan data user dan recipe muncul
- Better error handling dan fallback data
- Format tanggal Indonesia
- Proper data structure

## Jika Masalah Masih Terjadi

1. **Check database connection**
2. **Verify table names** (recipe_ratings, users, recipes)
3. **Check foreign key constraints**
4. **Run sample data SQL**
5. **Check backend console logs**
6. **Test API endpoints manually**

Dengan perubahan ini, masalah "Anonymous" dan "Unknown Recipe" seharusnya sudah teratasi!
