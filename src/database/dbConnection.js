require('dotenv').config();

const Sequelize = require('sequelize');

const DB_URL = process.env.DATABASE_URL;


const sequelize = new Sequelize(DB_URL, {dialect: 'postgres'});
 
module.exports = sequelize;