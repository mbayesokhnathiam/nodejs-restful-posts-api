require('dotenv').config(); // this is important!

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_DEV,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": false
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_TEST,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_PROD,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": false
  }
};
