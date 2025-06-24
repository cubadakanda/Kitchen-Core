import express from "express";
import {
    getUserFavorites,
    getUserFavoriteById,
    createUserFavorite,
    deleteUserFavorite,
    getUserFavoritesByUserId
} from "../controllers/user_favoritesControllers.js";

const router = express.Router();
router.get('/user-favorites', getUserFavorites);
router.get('/user-favorites/user/:userId/recipe/:recipeId', getUserFavoriteById);
router.get('/user-favorites/user/:userId', getUserFavoritesByUserId);
router.post('/user-favorites', createUserFavorite);
router.delete('/user-favorites/user/:userId/recipe/:recipeId', deleteUserFavorite);
export default router;
