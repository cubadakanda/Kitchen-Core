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
        console.log('Creating rating with data:', req.body);
        const newRating = await RecipeRatingModel.create(req.body);
        console.log('Rating created successfully:', newRating);
        res.status(201).json({msg: "rating created", data: newRating});
    } catch (error){
        console.error('Error creating rating:', error);
        res.status(500).json({error: error.message});
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
        console.log('Fetching ratings for recipe ID:', req.params.recipeId);
        const response = await RecipeRatingModel.findAll({
            where:{
                recipe_id: req.params.recipeId
            },
            order: [['created_at', 'DESC']]
        });
        console.log('Found ratings:', response.length);
        res.status(200).json(response);
    } catch (error){
        console.error('Error fetching ratings:', error);
        res.status(500).json({error: error.message});
    }
}

// Get average rating for a recipe
export const getRecipeAverageRating = async(req, res) =>{
    try {
        console.log('Calculating average rating for recipe ID:', req.params.recipeId);
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
        
        console.log(`Average rating: ${average}, Count: ${ratings.length}`);
        res.status(200).json({ 
            average: parseFloat(average.toFixed(1)), 
            count: ratings.length 
        });
    } catch (error){
        console.error('Error calculating average rating:', error);
        res.status(500).json({error: error.message});
    }
}
