import { Sequelize } from "sequelize";

const db = new Sequelize("db_web", "root", "", {
    host: "localhost",
    dialect: "mysql", 
});

export default db;