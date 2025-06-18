# Troubleshooting Favorites Error

## Error: NetworkError when attempting to fetch resource

Jika Anda mendapatkan error ini, berikut adalah langkah-langkah untuk memperbaikinya:

### 1. Pastikan Backend Berjalan

**Langkah 1: Start Backend**
```bash
# Navigasi ke folder backend
cd backend

# Install dependencies (jika belum)
npm install

# Start server
npm start
```

**Atau gunakan script batch yang sudah tersedia:**
```bash
# Dari root folder project
start-backend-debug.bat
```

### 2. Verifikasi Backend Berjalan

Buka browser dan akses: `http://localhost:5000/api/test`

Anda seharusnya melihat response:
```json
{
  "status": "success", 
  "message": "API is running",
  "timestamp": "..."
}
```

### 3. Cek Database Connection

Pastikan MySQL server berjalan dan database `db_web` sudah dibuat.

**Check logs di terminal backend:**
- Jika ada error "SequelizeConnectionRefusedError" → MySQL tidak berjalan
- Jika ada error "SequelizeDatabaseError" → Database belum dibuat

### 4. Troubleshooting CORS

Jika masih error, pastikan frontend berjalan di port 3000:
```bash
# Di folder frontend
npm start
```

### 5. Manual Testing API

Test API favorites secara manual:

**Get user favorites:**
```bash
curl http://localhost:5000/api/favorites/user/1
```

**Add favorite:**
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "recipe_id": 1}'
```

### 6. Error Messages Yang Ditangani

- **"Cannot connect to server"** → Backend tidak berjalan
- **"NetworkError"** → Koneksi terputus atau CORS issue
- **404 errors** → Normal untuk favorites yang tidak ada

### 7. Check Console Logs

Buka Developer Tools (F12) dan lihat console logs untuk detail error lebih lengkap.

## Status Saat Ini

✅ **Error handling** sudah diperbaiki
✅ **Logging** sudah ditambahkan untuk debugging
✅ **Fallback values** sudah diimplementasikan
✅ **User-friendly messages** sudah ditambahkan

Sistem favorites akan tetap berfungsi meski ada error koneksi, hanya tidak akan tersimpan ke database.
