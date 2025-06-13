import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserModel from "./usersModel.js";
import RecipeModel from "./recipesModel.js";
const { DataTypes } = Sequelize;

const RecipeRatingModel = db.define('recipe_ratings', {
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
    recipe_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: RecipeModel,
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'recipe_id']
        }
    ]
});

// Define associations
UserModel.hasMany(RecipeRatingModel, { foreignKey: 'user_id' });
RecipeModel.hasMany(RecipeRatingModel, { foreignKey: 'recipe_id' });
RecipeRatingModel.belongsTo(UserModel, { foreignKey: 'user_id' });
RecipeRatingModel.belongsTo(RecipeModel, { foreignKey: 'recipe_id' });

export default RecipeRatingModel;
