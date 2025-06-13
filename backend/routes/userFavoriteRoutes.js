import express from "express";
import {
    getUserFavorites,
    getUserFavoriteById,
    createUserFavorite,
    deleteUserFavorite,
    getUserFavoritesByUserId
} from "../controllers/user_favoritesControllers.js";

const router = express.Router();
router.get('/favorites', getUserFavorites);
router.get('/favorites/user/:userId/recipe/:recipeId', getUserFavoriteById);
router.get('/favorites/user/:userId', getUserFavoritesByUserId);
router.post('/favorites', createUserFavorite);
router.delete('/favorites/user/:userId/recipe/:recipeId', deleteUserFavorite);
export default router;
