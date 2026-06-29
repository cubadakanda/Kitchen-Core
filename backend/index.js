import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import UserRoute from "./routes/userRoutes.js";
import CategoryRoute from "./routes/categoryRoutes.js";
import RecipeRoute from "./routes/recipeRoutes.js";
import UserFavoriteRoute from "./routes/userFavoriteRoutes.js";
import RecipeRatingRoute from "./routes/recipeRatingRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Import all models to ensure they are loaded before sync
import "./models/usersModel.js";
import "./models/categoriesModel.js";
import "./models/recipesModel.js";
import "./models/user_favoritesModel.js";
import "./models/recipe_ratingsModel.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS properly
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Debug middleware to log all incoming requests
app.use('/api', (req, res, next) => {
    console.log(`\n=== ${new Date().toISOString()} ===`);
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers['content-type']);
    console.log('Body keys:', Object.keys(req.body || {}));
    
    if (req.body && req.body.image_data) {
        console.log('Image data detected - length:', req.body.image_data.length);
        console.log('Image filename:', req.body.image_filename);
        console.log('Image type:', req.body.image_type);
    }
    
    next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add API prefix to all routes
// API Test route
app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Image URL test route to check paths
app.get('/api/image-test', (req, res) => {
    res.json({
        status: 'success',
        message: 'Image paths test',
        imagePaths: {
            absolute: 'http://localhost:5000/images/recipes/test.jpg',
            relative: '/images/recipes/test.jpg',
            noLeadingSlash: 'images/recipes/test.jpg'
        }
    });
});

app.use('/api', UserRoute);
app.use('/api', CategoryRoute);
app.use('/api', RecipeRoute);
app.use('/api', UserFavoriteRoute);
app.use('/api', RecipeRatingRoute);

// Database sync with better error handling
const initDb = async () => {
    try {
        // Test database connection
        console.log('Attempting to connect to the database...');
        await db.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync database - creating tables if they don't exist
        console.log('Synchronizing database models...');
        await db.sync({ alter: true });
        console.log("Database synchronized successfully.");
        
        // Log all available tables
        console.log('Available tables:', Object.keys(db.models));
        
        // Check if we need to seed initial data
        const tableChecks = await Promise.all([
            db.query("SELECT COUNT(*) as count FROM categories"),
            db.query("SELECT COUNT(*) as count FROM users"),
            db.query("SELECT COUNT(*) as count FROM recipes")
        ]);
        
        const categoriesCount = tableChecks[0][0][0].count;
        const usersCount = tableChecks[1][0][0].count;
        const recipesCount = tableChecks[2][0][0].count;
        
        console.log(`Database stats - Categories: ${categoriesCount}, Users: ${usersCount}, Recipes: ${recipesCount}`);
        
        if (categoriesCount === 0 || usersCount === 0 || recipesCount === 0) {
            console.log("Database appears to be empty. You may want to run 'npm run seed' to add initial data.");
        }
        
        // If we reach here, the database is properly configured
        return true;
    } catch (error) {
        console.error("Error with database:", error);
        
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.error("Connection to the database was refused. Make sure MySQL is running.");
        } else if (error.name === 'SequelizeConnectionError') {
            console.error("Failed to connect to the database. Check your credentials in Database.js.");
        } else if (error.name === 'SequelizeDatabaseError') {
            console.error("Database 'db_web' might not exist. Create it or check Database.js.");
        } else {
            console.error("Unexpected database error:", error.message);
        }
        
        console.error("Fix the database issues before proceeding.");
        return false;
    }
};

// Initialize database then start server with better error handling
initDb().then((dbSuccess) => {
    if (dbSuccess) {
        app.listen(5000, () => {
            console.log('✅ Server up and running on port 5000');
            console.log('📂 API endpoints available at http://localhost:5000/api');
        });
    } else {
        // We'll still start the server even if database initialization fails
        // This allows API endpoints to return appropriate error messages
        console.warn('⚠️ Starting server with database issues - API will use fallback data');
        app.listen(5000, () => {
            console.log('⚠️ Server running on port 5000 with limited functionality');
            console.log('📂 Fix database issues for full functionality');
        });
    }
}).catch(err => {
    console.error('💥 Fatal error during initialization:', err);
    process.exit(1);
});