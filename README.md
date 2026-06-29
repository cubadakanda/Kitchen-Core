# Kitchen Core

A web application for managing recipes, users, and categories.

## Project Structure

The project is divided into two main parts:
- `frontend`: React application
- `backend`: Node.js/Express API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create the database (MySQL):
```sql
CREATE DATABASE db_web;
```

4. Start the server:
```
npm start
```

5. Seed the database with initial data (Optional):
```
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

## Troubleshooting

### Issue: Dashboard shows no data
- Make sure the backend server is running
- Check if database has been seeded with data by running `npm run seed` in the backend directory
- Check browser console for errors

### Issue: Recipe images don't appear
- The images should be in the `/images/recipes/` directory in your server
- Check if the image paths are correct in the database

## Login

Default admin credentials:
- Email: admin@kitchencore.com
- Password: password123
