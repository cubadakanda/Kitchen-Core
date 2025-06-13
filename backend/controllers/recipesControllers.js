import RecipeModel from "../models/recipesModel.js";

export const getRecipes = async(req, res) =>{
    try {
        const response = await RecipeModel.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getRecipeById = async(req, res) =>{
    try {
        const response = await RecipeModel.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
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
        await RecipeModel.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "recipe updated"});
    } catch (error){
        console.log(error.message);
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
