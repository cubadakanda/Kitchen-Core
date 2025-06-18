import UserFavoriteModel from "../models/user_favoritesModel.js";

export const getUserFavorites = async(req, res) =>{
    try {
        const response = await UserFavoriteModel.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getUserFavoriteById = async(req, res) =>{
    try {
        const response = await UserFavoriteModel.findOne({
            where:{
                user_id: req.params.userId,
                recipe_id: req.params.recipeId
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const createUserFavorite = async(req, res) =>{
    try {
        console.log('Creating favorite with data:', req.body);
        const newFavorite = await UserFavoriteModel.create(req.body);
        console.log('Favorite created successfully:', newFavorite);
        res.status(201).json({msg: "favorite created", data: newFavorite});
    } catch (error){
        console.error('Error creating favorite:', error);
        res.status(500).json({error: error.message});
    }
}

export const deleteUserFavorite = async(req, res) =>{
    try {
        console.log('Deleting favorite for user:', req.params.userId, 'recipe:', req.params.recipeId);
        const deleted = await UserFavoriteModel.destroy({
            where:{
                user_id: req.params.userId,
                recipe_id: req.params.recipeId
            }
        });
        console.log('Favorite deleted:', deleted);
        res.status(200).json({msg: "favorite deleted", deleted: deleted});
    } catch (error){
        console.error('Error deleting favorite:', error);
        res.status(500).json({error: error.message});
    }
}

// Get favorites for specific user
export const getUserFavoritesByUserId = async(req, res) =>{
    try {
        console.log('Fetching favorites for user ID:', req.params.userId);
        const response = await UserFavoriteModel.findAll({
            where:{
                user_id: req.params.userId
            }
            // Removed include for now to fix the error
        });
        console.log('Found favorites:', response.length);
        res.status(200).json(response);
    } catch (error){
        console.error('Error fetching user favorites:', error);
        res.status(500).json({error: error.message});
    }
}
