# Authentication Flow Update

## Perubahan yang Dibuat

### 1. App.js - Routing Logic Update
- **Sebelum**: Route root (`/`) langsung mengarah ke `<Home />` tanpa pengecekan authentication
- **Sesudah**: 
  - Route root (`/`) menggunakan komponen `<RootRoute />` yang melakukan pengecekan authentication
  - Jika user belum login → redirect ke `/auth`
  - Jika user admin → redirect ke `/admin/dashboard`  
  - Jika user biasa → redirect ke `/home`
  - Semua route user dan recipes sekarang protected (memerlukan login)

### 2. Header.jsx - Navigation Links Update
- **Sebelum**: Brand logo dan menu Home mengarah ke `/`
- **Sesudah**: Brand logo dan menu Home mengarah ke `/home`

### 3. AuthContext.jsx - Logout Enhancement
- **Sebelum**: Logout hanya membersihkan localStorage
- **Sesudah**: Logout membersihkan localStorage + force redirect ke `/auth` menggunakan `window.location.href`

## Flow Authentication Baru

1. **Akses Pertama Kali**:
   - User mengakses aplikasi di URL apapun
   - Jika belum login → otomatis redirect ke `/auth`
   - User harus login/register terlebih dahulu

2. **Setelah Login Berhasil**:
   - Admin → redirect ke `/admin/dashboard`
   - User biasa → redirect ke `/home`

3. **Navigasi Dalam Aplikasi**:
   - Semua halaman utama (home, recipes, profile, my-recipes) memerlukan authentication
   - Jika token invalid/expired → otomatis redirect ke `/auth`

4. **Logout**:
   - Membersihkan semua data authentication
   - Force redirect ke halaman auth

## Protected Routes
- `/home` - Homepage untuk user yang sudah login
- `/recipes` - Daftar semua recipes  
- `/recipes/:id` - Detail recipe
- `/profile` - Profile user
- `/my-recipes` - Recipe milik user
- `/my-recipes/create` - Buat recipe baru
- `/my-recipes/edit/:id` - Edit recipe user
- Semua route admin (`/admin/*`)

## Public Routes
- `/auth` - Halaman login/register
- Redirect routes (`/login`, `/register` → `/auth`)

## Testing
Untuk menguji flow baru:
1. Buka aplikasi di browser
2. Akan otomatis redirect ke halaman auth
3. Login dengan credentials yang valid
4. Akan redirect ke home page
5. Coba akses URL lain → tetap bisa akses karena sudah login
6. Logout → akan kembali ke halaman auth
7. Coba akses URL protected tanpa login → akan redirect ke auth
