import CategoryModel from "../models/categoriesModel.js";

export const getCategories = async(req, res) =>{
    try {
        const response = await CategoryModel.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getCategoryById = async(req, res) =>{
    try {
        const response = await CategoryModel.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const createCategory = async(req, res) =>{
    try {
        await CategoryModel.create(req.body);
        res.status(201).json({msg: "category created"});
    } catch (error){
        console.log(error.message);
    }
}

export const updateCategory = async(req, res) =>{
    try {
        await CategoryModel.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "category updated"});
    } catch (error){
        console.log(error.message);
    }
}

export const deleteCategory = async(req, res) =>{
    try {
        await CategoryModel.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "category deleted"});
    } catch (error){
        console.log(error.message);
    }
}
