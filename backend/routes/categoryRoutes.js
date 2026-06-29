import express from "express";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoriesControllers.js";

const router = express.Router();
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.put('/categories/:id', updateCategory); // Add PUT method to support both PATCH and PUT
router.delete('/categories/:id', deleteCategory);
export default router;
