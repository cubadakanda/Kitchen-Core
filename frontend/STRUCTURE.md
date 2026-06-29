# Kitchen Core Frontend Structure

## Struktur Folder

```
src/
├── components/           # Komponen reusable
│   ├── common/          # Komponen umum (Header, Footer, Loading, dll)
│   ├── admin/           # Komponen khusus admin
│   └── user/            # Komponen khusus user
├── pages/               # Halaman-halaman aplikasi
│   ├── auth/           # Halaman authentication (Login, Register)
│   ├── admin/          # Halaman admin (Dashboard, Manage data)
│   └── user/           # Halaman user (Home, Recipes, Profile)
├── layouts/            # Layout wrapper components
├── services/           # API calls dan business logic
├── hooks/              # Custom React hooks
├── context/            # React Context untuk state management
├── utils/              # Helper functions dan utilities
├── styles/             # CSS files
└── assets/             # Static assets (images, icons)
    ├── images/
    └── icons/
```

## Deskripsi Folder

### 📁 components/
- **common/**: Komponen yang digunakan di seluruh aplikasi
- **admin/**: Komponen khusus untuk halaman admin
- **user/**: Komponen khusus untuk halaman user

### 📁 pages/
- **auth/**: Halaman login, register, forgot password
- **admin/**: Dashboard admin, manage recipes, users, categories
- **user/**: Homepage, recipe listing, recipe detail, favorites

### 📁 layouts/
- Layout wrapper untuk mengatur struktur halaman
- MainLayout untuk user, AdminLayout untuk admin

### 📁 services/
- API service functions
- authService.js: Authentication related APIs
- recipeService.js: Recipe related APIs
- categoryService.js: Category related APIs

### 📁 hooks/
- Custom React hooks untuk logic reusable
- useAuth, useRecipes, useFavorites, dll

### 📁 context/
- React Context untuk state management global
- AuthContext: User authentication state
- RecipeContext: Recipe data state

### 📁 utils/
- Helper functions
- Constants
- Validation functions
- Format functions

### 📁 styles/
- CSS files
- globals.css: Global styles
- components.css: Component specific styles

### 📁 assets/
- Static files (images, icons, fonts)

## Role-based Structure

### Admin Features:
- Dashboard dengan statistik
- Manage recipes (CRUD)
- Manage categories (CRUD)
- Manage users
- View dan manage ratings

### User Features:
- Browse recipes
- Search dan filter recipes
- Add recipes to favorites
- Rate recipes
- View recipe details

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Install additional packages yang mungkin diperlukan:
```bash
npm install react-router-dom axios
```

3. Start development server:
```bash
npm start
```

## Recommended Package Installation

```bash
npm install react-router-dom axios styled-components
```

Struktur ini mengikuti best practices untuk aplikasi React dengan multiple roles dan memudahkan maintenance serta scalability.
