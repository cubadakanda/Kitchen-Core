import CategoryModel from "../models/categoriesModel.js";

export const getCategories = async(req, res) =>{
    try {
        console.log('Attempting to fetch all categories...');
        const response = await CategoryModel.findAll();
        console.log(`Successfully retrieved ${response.length} categories`);
        res.status(200).json(response);
    } catch (error){
        console.error('Error fetching categories:', error);
        
        // Check for specific database connection errors
        if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
            return res.status(500).json({ 
                error: "Database connection error. Please check your database configuration.", 
                details: error.message
            });
        }
        
        // Check for table not found errors
        if (error.message && error.message.includes('ER_NO_SUCH_TABLE')) {
            return res.status(500).json({ 
                error: "The categories table does not exist. Please ensure your database is properly set up.",
                details: error.message 
            });
        }

        res.status(500).json({ 
            error: "An error occurred while fetching categories", 
            details: error.message
        });
    }
}

export const getCategoryById = async(req, res) =>{
    try {
        const response = await CategoryModel.findOne({
            where:{
                id: req.params.id
            }
        });
        if (!response) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
        res.status(500).json({ error: error.message || "An error occurred while fetching the category" });
    }
}

export const createCategory = async(req, res) =>{
    try {
        // Validate required fields
        if (!req.body.name) {
            return res.status(400).json({ error: "Category name is required" });
        }
        
        // Generate slug from name
        const slug = req.body.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        
        // Create the category with properly generated slug
        const categoryData = {
            ...req.body,
            slug
        };
        
        console.log('Creating category with data:', categoryData);
        const newCategory = await CategoryModel.create(categoryData);
        console.log('Category created successfully:', newCategory.toJSON());
        
        res.status(201).json(newCategory);
    } catch (error){
        console.error('Error creating category:', error);
        res.status(500).json({ error: error.message || "An error occurred while creating the category" });
    }
}

export const updateCategory = async(req, res) =>{
    try {
        // Generate slug from name if name is being updated
        if (req.body.name && !req.body.slug) {
            req.body.slug = req.body.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
        }

        const [updated] = await CategoryModel.update(req.body, {
            where: { id: req.params.id }
        });
        
        if (updated === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        const updatedCategory = await CategoryModel.findByPk(req.params.id);
        res.status(200).json(updatedCategory);
    } catch (error){
        console.log(error.message);
        res.status(500).json({ error: error.message || "An error occurred while updating the category" });
    }
}

export const deleteCategory = async(req, res) =>{
    try {
        const deleted = await CategoryModel.destroy({
            where:{
                id: req.params.id
            }
        });
        
        if (deleted === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error){
        console.log(error.message);
        res.status(500).json({ error: error.message || "An error occurred while deleting the category" });
    }
}
