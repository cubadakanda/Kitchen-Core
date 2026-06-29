import { Sequelize } from "sequelize";

const db = new Sequelize("db_web", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: console.log, // Enable SQL query logging for debugging
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // Additional options to make connection more reliable
    dialectOptions: {
        connectTimeout: 60000 // Increase connection timeout
    }
});

export default db;