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
        await UserFavoriteModel.create(req.body);
        res.status(201).json({msg: "favorite created"});
    } catch (error){
        console.log(error.message);
    }
}

export const deleteUserFavorite = async(req, res) =>{
    try {
        await UserFavoriteModel.destroy({
            where:{
                user_id: req.params.userId,
                recipe_id: req.params.recipeId
            }
        });
        res.status(200).json({msg: "favorite deleted"});
    } catch (error){
        console.log(error.message);
    }
}

// Get favorites for specific user
export const getUserFavoritesByUserId = async(req, res) =>{
    try {
        const response = await UserFavoriteModel.findAll({
            where:{
                user_id: req.params.userId
            },
            include: 'favoriteRecipes' // This requires proper association setup
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}
