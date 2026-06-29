import UserFavoriteModel from "../models/user_favoritesModel.js";
import RecipeModel from "../models/recipesModel.js";
import CategoryModel from "../models/categoriesModel.js";
import UserModel from "../models/usersModel.js";

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
        
        // Try manual query approach to avoid association issues
        const favorites = await UserFavoriteModel.findAll({
            where: {
                user_id: req.params.userId
            }
        });
        
        console.log('Found favorites:', favorites.length);
        
        if (favorites.length === 0) {
            return res.status(200).json([]);
        }
        
        // Manually fetch recipe data for each favorite
        const favoritesWithRecipes = await Promise.all(
            favorites.map(async (favorite) => {
                try {
                    const recipe = await RecipeModel.findByPk(favorite.recipe_id, {
                        attributes: ['id', 'title', 'description', 'image_url', 'cooking_time', 'prep_time', 'calories'],
                        include: [
                            {
                                model: CategoryModel,
                                as: 'category',
                                attributes: ['id', 'name']
                            },
                            {
                                model: UserModel,
                                as: 'user',
                                attributes: ['id', 'name']
                            }
                        ]
                    });
                    
                    return {
                        user_id: favorite.user_id,
                        recipe_id: favorite.recipe_id,
                        created_at: favorite.created_at,
                        recipe: recipe
                    };
                } catch (recipeError) {
                    console.error('Error fetching recipe:', favorite.recipe_id, recipeError.message);
                    return {
                        user_id: favorite.user_id,
                        recipe_id: favorite.recipe_id,
                        created_at: favorite.created_at,
                        recipe: null
                    };
                }
            })
        );
        
        console.log('Successfully processed favorites with recipes');
        res.status(200).json(favoritesWithRecipes);
        
    } catch (error){
        console.error('Error fetching user favorites:', error);
        console.error('Error details:', error.stack);
        res.status(500).json({error: error.message});
    }
}
