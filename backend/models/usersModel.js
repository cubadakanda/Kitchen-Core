import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const {DataTypes} = Sequelize;

const UserModel = db.define('users',{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name:DataTypes.STRING,
    email:DataTypes.STRING,
    password:DataTypes.STRING,
    role:{
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    gender:{
        type: DataTypes.ENUM('laki-laki', 'perempuan'),
        allowNull: true
    }
},{
    freezeTableName:true
});
export default UserModel;
