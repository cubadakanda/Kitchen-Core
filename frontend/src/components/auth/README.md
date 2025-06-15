# Kitchen Core - Sliding Authentication

## Color Palette
Aplikasi ini menggunakan palet warna yang hangat dan modern:

- **Primary Color (Background Light)**: `#FAF9F6` - Warm off-white
- **Accent Color (Primary)**: `#B7410E` - Rust orange
- **Secondary Accent**: `#9a3408` - Darker rust
- **Tertiary Accent**: `#7a2906` - Deep rust

## Features

### Sliding Authentication Form
- **Design terinspirasi dari**: [Sliding Sign-In Sign-Up Form](https://github.com/sefyudem/Sliding-Sign-In-Sign-Up-Form)
- **Animasi smooth**: Transisi halus antara form login dan register
- **Responsive design**: Bekerja optimal di semua ukuran layar
- **Modern UI**: Menggunakan backdrop blur dan shadow effects

### Authentication Flow
1. **Login Form** (default)
   - Email dan password input
   - Validasi real-time
   - Error handling
   
2. **Register Form** (slide animation)
   - Full name, email, dan password
   - Success feedback
   - Auto-redirect ke login setelah berhasil

### Visual Elements
- **Icons**: Font Awesome icons untuk input fields
- **Illustrations**: Custom SVG illustrations untuk cooking theme
- **Gradient Background**: Circular gradient dengan warna brand
- **Glass Effect**: Form dengan backdrop blur effect

## Component Structure
```
components/auth/
├── SlidingAuth.jsx      # Main component
├── SlidingAuth.css      # Styling with brand colors
```

## Usage
Komponen ini terintegrasi dengan:
- React Router untuk navigasi
- Auth Context untuk state management
- Auth Service untuk API calls

## Color Usage
- `#FAF9F6`: Background utama, form background, text on dark background
- `#B7410E`: Buttons, icons, titles, primary accent
- `#9a3408`: Button hover states, gradient middle
- `#7a2906`: Gradient end, deep accent

## Responsive Breakpoints
- Desktop: Full sliding animation
- Tablet (870px): Stacked layout dengan animasi vertikal
- Mobile (570px): Simplified layout tanpa illustrations
