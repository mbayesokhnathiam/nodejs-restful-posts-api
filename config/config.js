require('dotenv').config(); // this is important!
const Sequelize = require("sequelize");

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_DEV,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": Sequelize.Op
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_TEST,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": Sequelize.Op
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_PROD,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": Sequelize.Op
  }
};
