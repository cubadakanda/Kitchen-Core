import RecipeModel from "../models/recipesModel.js";
import CategoryModel from "../models/categoriesModel.js";
import UserModel from "../models/usersModel.js";

export const getRecipes = async(req, res) =>{
    try {
        const response = await RecipeModel.findAll({
            include: [
                {
                    model: CategoryModel,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch recipes", 
            error: error.message 
        });
    }
}

export const getRecipeById = async(req, res) =>{
    try {
        const response = await RecipeModel.findOne({
            where:{
                id: req.params.id
            },
            include: [
                {
                    model: CategoryModel,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        if (!response) {
            return res.status(404).json({ 
                success: false, 
                message: "Recipe not found" 
            });
        }
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch recipe", 
            error: error.message 
        });
    }
}

export const createRecipe = async(req, res) =>{
    try {
        await RecipeModel.create(req.body);
        res.status(201).json({msg: "recipe created"});
    } catch (error){
        console.log(error.message);
    }
}

export const updateRecipe = async(req, res) =>{
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Log the incoming data for debugging
        console.log('Updating recipe with ID:', id);
        console.log('Update data:', updateData);
        
        const [updatedRowsCount] = await RecipeModel.update(updateData, {
            where: {
                id: id
            }
        });
        
        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        
        // Fetch the updated recipe to return it
        const updatedRecipe = await RecipeModel.findOne({
            where: { id: id },
            include: [
                {
                    model: CategoryModel,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        
        res.status(200).json({
            success: true,
            message: "Recipe updated successfully",
            data: updatedRecipe
        });
    } catch (error){
        console.log('Error updating recipe:', error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update recipe",
            error: error.message
        });
    }
}

export const deleteRecipe = async(req, res) =>{
    try {
        await RecipeModel.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "recipe deleted"});
    } catch (error){
        console.log(error.message);
    }
}
