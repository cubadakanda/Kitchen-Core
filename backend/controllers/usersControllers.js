import UserModel from "../models/usersModel.js";

export const getUsers = async(req, res) =>{
    try {
        const response = await UserModel.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await UserModel.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}
export const createUser = async(req, res) =>{
    try {
        await UserModel.create(req.body);
        res.status(201).json({msg: "user created"});
    } catch (error){
        console.log(error.message);
    }
}

export const updateUser = async(req, res) =>{
    try {
        await UserModel.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "user updated"});
    } catch (error){
        console.log(error.message);
    }
}

export const deleteUser = async(req, res) =>{
    try {
        await UserModel.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "user deleted"});
    } catch (error){
        console.log(error.message);
    }
}