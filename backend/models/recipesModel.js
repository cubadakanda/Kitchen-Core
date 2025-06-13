import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./usersModel.js";
import CategoryModel from "./categoriesModel.js";
const { DataTypes } = Sequelize;

const RecipeModel = db.define('recipes', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CategoryModel,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ingredients: {
        type: DataTypes.TEXT,  // Atau bisa menggunakan DataTypes.JSON jika database mendukung
        allowNull: false
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    prep_time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cook_time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    servings: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('published', 'draft'),
        defaultValue: 'draft'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
RecipeModel.belongsTo(UserModel, { foreignKey: 'user_id' });
RecipeModel.belongsTo(CategoryModel, { foreignKey: 'category_id' });
UserModel.hasMany(RecipeModel, { foreignKey: 'user_id' });
CategoryModel.hasMany(RecipeModel, { foreignKey: 'category_id' });

export default RecipeModel;
