import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./usersModel.js";
import RecipeModel from "./recipesModel.js";
const { DataTypes } = Sequelize;

const UserFavoriteModel = db.define('user_favorites', {
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: UserModel,
            key: 'id'
        }
    },
    recipe_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: RecipeModel,
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Define associations
UserModel.belongsToMany(RecipeModel, { 
    through: UserFavoriteModel, 
    foreignKey: 'user_id', 
    otherKey: 'recipe_id', 
    as: 'favoriteRecipes' 
});

RecipeModel.belongsToMany(UserModel, { 
    through: UserFavoriteModel, 
    foreignKey: 'recipe_id', 
    otherKey: 'user_id', 
    as: 'userFavorites' 
});

export default UserFavoriteModel;
