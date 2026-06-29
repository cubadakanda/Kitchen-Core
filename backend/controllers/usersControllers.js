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

// Login endpoint
export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        
        // Cari user berdasarkan email
        const user = await UserModel.findOne({
            where: { email: email }
        });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Validasi password (dalam aplikasi real, gunakan bcrypt untuk hash password)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Login berhasil
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: `token-${user.id}-${Date.now()}`
            }
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Register endpoint
export const registerUser = async(req, res) => {
    try {
        console.log('=== REGISTER REQUEST ===');
        console.log('Register request body:', req.body);
        const { name, email, password } = req.body;
        
        // Validasi input
        if (!name || !email || !password) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }
        
        console.log('Checking if user exists with email:', email);
        // Cek apakah user sudah ada
        const existingUser = await UserModel.findOne({
            where: { email: email }
        });
        
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }
        
        console.log('Creating new user...');
        // Buat user baru
        const newUser = await UserModel.create({
            name: name,
            email: email,
            password: password, // Dalam aplikasi real, hash password dengan bcrypt
            role: 'user' // Default role
        });
        
        console.log('User created successfully:', newUser.toJSON());
        res.status(201).json({
            success: true,
            message: "Registration successful! Please login.",
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}