import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import UserRoute from "./routes/userRoutes.js";
import CategoryRoute from "./routes/categoryRoutes.js";
import RecipeRoute from "./routes/recipeRoutes.js";
import UserFavoriteRoute from "./routes/userFavoriteRoutes.js";
import RecipeRatingRoute from "./routes/recipeRatingRoutes.js";

// Import all models to ensure they are loaded before sync
import "./models/usersModel.js";
import "./models/categoriesModel.js";
import "./models/recipesModel.js";
import "./models/user_favoritesModel.js";
import "./models/recipe_ratingsModel.js";

const app = express();

// Configure CORS properly
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add API prefix to all routes
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