import RecipeModel from "../models/recipesModel.js";
import CategoryModel from "../models/categoriesModel.js";
import UserModel from "../models/usersModel.js";
import RecipeRatingModel from "../models/recipe_ratingsModel.js";
import db from "../config/Database.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        // Calculate average rating for each recipe
        const recipesWithRating = await Promise.all(response.map(async (recipe) => {
            const ratings = await RecipeRatingModel.findAll({
                where: { recipe_id: recipe.id },
                attributes: ['rating']
            });
            
            const avgRating = ratings.length > 0 
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
                : 0;
            
            return {
                ...recipe.toJSON(),
                avg_rating: parseFloat(avgRating.toFixed(1)),
                rating_count: ratings.length
            };
        }));

        res.status(200).json(recipesWithRating);
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
        const recipeData = { ...req.body };
        
        // Handle image upload if base64 data is provided
        if (req.body.image_data && req.body.image_filename && req.body.image_type) {
            try {
                const imagePath = saveBase64Image(
                    req.body.image_data, 
                    req.body.image_filename, 
                    req.body.image_type
                );
                recipeData.image_url = imagePath;
                
                // Remove base64 data from the record (we don't want to store it in DB)
                delete recipeData.image_data;
                delete recipeData.image_filename;
                delete recipeData.image_type;
                
                console.log('Image processed and saved for new recipe');
            } catch (imageError) {
                console.error('Image processing failed:', imageError);
                // Continue without image if upload fails
                delete recipeData.image_data;
                delete recipeData.image_filename;
                delete recipeData.image_type;
            }
        }
        
        const newRecipe = await RecipeModel.create(recipeData);
        res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            data: newRecipe
        });
    } catch (error){
        console.log('Error creating recipe:', error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create recipe",
            error: error.message
        });
    }
}

export const updateRecipe = async(req, res) =>{
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
          // Log the incoming data for debugging
        console.log('=== BACKEND DEBUG ===');
        console.log('Updating recipe with ID:', id);
        console.log('Update data keys:', Object.keys(updateData));
        console.log('image_data exists:', !!req.body.image_data);
        console.log('image_filename:', req.body.image_filename);
        console.log('image_type:', req.body.image_type);
        console.log('Current image_url in data:', updateData.image_url);
        console.log('=== END BACKEND DEBUG ===');
        
        // Handle image upload if base64 data is provided
        if (req.body.image_data && req.body.image_filename && req.body.image_type) {
            console.log('Processing new image upload...');
            try {
                // Get existing recipe to potentially remove old image
                const existingRecipe = await RecipeModel.findByPk(id);
                
                const imagePath = saveBase64Image(
                    req.body.image_data, 
                    req.body.image_filename, 
                    req.body.image_type
                );
                updateData.image_url = imagePath;
                console.log('New image saved at:', imagePath);
                
                // Remove base64 data from the update record
                delete updateData.image_data;
                delete updateData.image_filename;
                delete updateData.image_type;
                
                console.log('Image processed and saved for recipe update');
                
                // Optionally remove old image file (commented out for safety)
                /*
                if (existingRecipe && existingRecipe.image_url && existingRecipe.image_url.startsWith('/uploads/')) {
                    const oldImagePath = path.join(__dirname, '..', existingRecipe.image_url);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log('Old image removed:', existingRecipe.image_url);
                    }
                }
                */
            } catch (imageError) {
                console.error('Image processing failed:', imageError);
                // Continue with update without image changes if upload fails
                delete updateData.image_data;
                delete updateData.image_filename;
                delete updateData.image_type;
            }
        } else {
            // Remove image-related fields if they exist but are not complete
            delete updateData.image_data;
            delete updateData.image_filename;
            delete updateData.image_type;
        }
        
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

// Helper function to save base64 image data
const saveBase64Image = (base64Data, filename, fileType) => {
    try {
        console.log('=== SAVE BASE64 IMAGE DEBUG ===');
        console.log('Filename:', filename);
        console.log('FileType:', fileType);
        console.log('Base64 data length:', base64Data ? base64Data.length : 'null');
        console.log('Base64 starts with data:image:', base64Data?.startsWith('data:image'));
        
        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('Uploads directory created:', uploadsDir);
        }

        // Remove data:image/xxx;base64, prefix
        const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = fileType.split('/')[1] || 'jpg';
        const uniqueFilename = `${timestamp}_${randomString}_${filename || 'image'}.${extension}`;
        
        const filePath = path.join(uploadsDir, uniqueFilename);
        
        console.log('Saving to path:', filePath);
        console.log('Cleaned base64 length:', base64Image.length);
        
        // Save the file
        fs.writeFileSync(filePath, base64Image, 'base64');
        
        console.log('Image saved successfully:', uniqueFilename);
        console.log('=== END SAVE BASE64 IMAGE DEBUG ===');
        return `/uploads/${uniqueFilename}`;
    } catch (error) {
        console.error('Error saving image:', error);
        throw new Error('Failed to save image');
    }
};
