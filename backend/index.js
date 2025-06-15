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

// Database sync
const initDb = async () => {
    try {
        // Test database connection
        await db.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync database
        await db.sync();
        console.log("Database synchronized");
        
        // Log all available tables
        console.log('Available tables:', Object.keys(db.models));
        
    } catch (error) {
        console.error("Error with database:", error);
        console.error("Make sure MySQL is running and database 'db_web' exists");
    }
};

// Initialize database then start server
initDb().then(() => {
    app.listen(5000, () => console.log('Server up and running on port 5000'));
});