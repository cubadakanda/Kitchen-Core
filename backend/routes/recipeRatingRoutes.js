import express from "express";
import {
    getRecipeRatings,
    getRecipeRatingById,
    createRecipeRating,
    updateRecipeRating,
    deleteRecipeRating,
    getRecipeRatingsByRecipeId,
    getRecipeAverageRating
} from "../controllers/recipe_ratingsControllers.js";

const router = express.Router();
router.get('/ratings', getRecipeRatings);
router.get('/ratings/:id', getRecipeRatingById);
router.get('/ratings/recipe/:recipeId', getRecipeRatingsByRecipeId);
router.get('/ratings/recipe/:recipeId/average', getRecipeAverageRating);
router.post('/ratings', createRecipeRating);
router.patch('/ratings/:id', updateRecipeRating);
router.delete('/ratings/:id', deleteRecipeRating);
export default router;
