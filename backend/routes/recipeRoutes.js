import express from "express";
import {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
} from "../controllers/recipesControllers.js";

const router = express.Router();
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);
router.post('/recipes', createRecipe);
router.patch('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);
export default router;
