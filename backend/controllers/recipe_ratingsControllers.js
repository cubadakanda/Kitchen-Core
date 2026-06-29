import RecipeRatingModel from "../models/recipe_ratingsModel.js";
import UserModel from "../models/usersModel.js";
import RecipeModel from "../models/recipesModel.js";
import db from "../config/Database.js";

export const getRecipeRatings = async(req, res) =>{
    try {
        const response = await RecipeRatingModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: RecipeModel,
                    attributes: ['id', 'title']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
        res.status(500).json({error: error.message});
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

// Get rating statistics for admin dashboard
export const getRatingStats = async(req, res) => {
    try {
        console.log('Fetching rating statistics...');
        
        const totalRatings = await RecipeRatingModel.count();
        console.log('Total ratings:', totalRatings);
        
        // Get average rating using raw query for better compatibility
        const avgRatingResult = await db.query(
            'SELECT AVG(rating) as avg_rating FROM recipe_ratings',
            { type: db.QueryTypes.SELECT }
        );
        const avgRating = avgRatingResult[0]?.avg_rating || 0;
        console.log('Average rating:', avgRating);
        
        // Get rating distribution
        const ratingDistribution = await db.query(
            'SELECT rating, COUNT(*) as count FROM recipe_ratings GROUP BY rating ORDER BY rating ASC',
            { type: db.QueryTypes.SELECT }
        );
        console.log('Rating distribution:', ratingDistribution);        // Get recent ratings with user and recipe info
        const recentRatings = await db.query(`
            SELECT 
                rr.id,
                rr.rating,
                rr.review_text,
                rr.created_at,
                u.name as user_name,
                u.email as user_email,
                r.title as recipe_title,
                r.id as recipe_id
            FROM recipe_ratings rr
            LEFT JOIN users u ON rr.user_id = u.id
            LEFT JOIN recipes r ON rr.recipe_id = r.id
            ORDER BY rr.created_at DESC
            LIMIT 10
        `, { type: db.QueryTypes.SELECT });

        console.log('Recent ratings raw query result:', recentRatings);

        // Transform to match expected format
        const formattedRecentRatings = recentRatings.map(rating => ({
            id: rating.id,
            rating: rating.rating,
            review_text: rating.review_text,
            created_at: rating.created_at,
            User: {
                name: rating.user_name,
                email: rating.user_email
            },
            Recipe: {
                title: rating.recipe_title,
                id: rating.recipe_id
            }
        }));        const result = {
            totalRatings,
            averageRating: parseFloat(avgRating).toFixed(1),
            ratingDistribution: ratingDistribution.map(item => ({
                rating: parseInt(item.rating),
                count: parseInt(item.count)
            })),
            recentRatings: formattedRecentRatings
        };

        console.log('Rating stats result:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching rating stats:', error);
        res.status(500).json({ 
            error: error.message,
            totalRatings: 0,
            averageRating: '0.0',
            ratingDistribution: [],
            recentRatings: []
        });
    }
};
