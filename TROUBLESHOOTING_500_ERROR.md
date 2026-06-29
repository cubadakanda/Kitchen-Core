# Troubleshooting: HTTP 500 Error pada Favorites

## Error yang Terjadi
```
Error fetching user favorites: Error: HTTP error! status: 500
```

## Kemungkinan Penyebab dan Solusi

### 1. **Association/Relasi Database Bermasalah**

**Gejala:** Error 500 saat mengambil data favorites  
**Penyebab:** Relasi antara UserFavorite dan Recipe tidak benar  
**Solusi:** Sudah diubah menggunakan manual query tanpa relasi kompleks

### 2. **Backend Tidak Berjalan**

**Cara Cek:**
```bash
# Di terminal, masuk ke folder backend
cd backend
npm start
```

**Expected Output:**
```
✅ Server up and running on port 5000
📂 API endpoints available at http://localhost:5000/api
```

### 3. **Database Connection Error**

**Cara Cek:**
- Pastikan MySQL berjalan
- Database `db_web` sudah dibuat
- Kredensial di `backend/config/Database.js` benar

### 4. **Model Import Issues**

**Yang Sudah Diperbaiki:**
- Import model di controller sudah benar
- Association sudah disederhanakan
- Menggunakan manual query untuk menghindari circular dependency

## Langkah Debugging

### 1. Cek Backend Status
```bash
# Test apakah backend hidup
curl http://localhost:5000/api/test
```

### 2. Cek Favorites API Langsung
```bash
# Test favorites endpoint
curl http://localhost:5000/api/user-favorites/user/1
```

### 3. Lihat Console Backend
Buka terminal backend dan lihat error message yang muncul saat API dipanggil.

### 4. Cek Database
```sql
-- Cek apakah tabel user_favorites ada
DESCRIBE user_favorites;

-- Cek apakah ada data
SELECT * FROM user_favorites LIMIT 5;
```

## Kode yang Sudah Diperbaiki

### Backend Controller (`user_favoritesControllers.js`)
- Menggunakan manual query tanpa complex associations
- Error handling yang lebih baik
- Fallback jika recipe data tidak ditemukan

### Frontend Service (`favoriteService.js`)
- Error handling yang lebih detail
- Logging yang lebih informatif
- Graceful fallback ke empty array

### Frontend Profile (`Profile.jsx`)
- Filter untuk favorites yang valid
- Handle case dimana recipe data null

## Test Script

Gunakan file `test-favorites-api.js` untuk test API:

```bash
# Install node-fetch jika belum ada
npm install node-fetch

# Jalankan test
node test-favorites-api.js
```

## Solusi Sementara

Jika masih error, coba langkah ini:

1. **Restart Backend:**
```bash
cd backend
npm install
npm start
```

2. **Clear Browser Cache:**
- F12 → Application → Storage → Clear Storage

3. **Cek Error di Backend Console:**
Lihat detail error di terminal backend

4. **Manual Test dengan Postman:**
- GET `http://localhost:5000/api/user-favorites/user/1`
- Lihat response dan error detail

## Status Perbaikan

✅ **Fixed:**
- Port mismatch (3001 → 5000)
- Route pattern inconsistency
- Complex association issues
- Error handling improved

🔧 **Testing:**
- Manual query approach implemented
- Better error logging added
- Fallback mechanisms in place

## Langkah Selanjutnya

1. Start backend dan cek console untuk error messages
2. Test API dengan script atau Postman
3. Jika masih error, share console output backend untuk debugging lebih lanjut
