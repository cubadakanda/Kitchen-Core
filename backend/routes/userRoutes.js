import express from "express";
import {getUsers,getUserById,createUser,updateUser,deleteUser,loginUser,registerUser} from "../controllers/usersControllers.js";


const router = express.Router();
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Auth routes
router.post('/users/login', loginUser);
router.post('/users/register', registerUser);

export default router;