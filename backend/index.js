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
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(CategoryRoute);
app.use(RecipeRoute);
app.use(UserFavoriteRoute);
app.use(RecipeRatingRoute);

// Database sync
const initDb = async () => {
    try {
        await db.sync();
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
};

// Initialize database then start server
initDb().then(() => {
    app.listen(5000, () => console.log('Server up and running on port 5000'));
});