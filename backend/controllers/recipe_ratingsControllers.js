import RecipeRatingModel from "../models/recipe_ratingsModel.js";

export const getRecipeRatings = async(req, res) =>{
    try {
        const response = await RecipeRatingModel.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getRecipeRatingById = async(req, res) =>{
    try {
        const response = await RecipeRatingModel.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const createRecipeRating = async(req, res) =>{
    try {
        await RecipeRatingModel.create(req.body);
        res.status(201).json({msg: "rating created"});
    } catch (error){
        console.log(error.message);
    }
}

export const updateRecipeRating = async(req, res) =>{
    try {
        await RecipeRatingModel.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "rating updated"});
    } catch (error){
        console.log(error.message);
    }
}

export const deleteRecipeRating = async(req, res) =>{
    try {
        await RecipeRatingModel.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "rating deleted"});
    } catch (error){
        console.log(error.message);
    }
}

// Get ratings for a specific recipe
export const getRecipeRatingsByRecipeId = async(req, res) =>{
    try {
        const response = await RecipeRatingModel.findAll({
            where:{
                recipe_id: req.params.recipeId
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

// Get average rating for a recipe
export const getRecipeAverageRating = async(req, res) =>{
    try {
        const ratings = await RecipeRatingModel.findAll({
            where:{
                recipe_id: req.params.recipeId
            },
            attributes: ['rating']
        });
        
        if(ratings.length === 0) {
            return res.status(200).json({ average: 0, count: 0 });
        }
        
        const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
        const average = sum / ratings.length;
        
        res.status(200).json({ 
            average: parseFloat(average.toFixed(1)), 
            count: ratings.length 
        });
    } catch (error){
        console.log(error.message);
    }
}
