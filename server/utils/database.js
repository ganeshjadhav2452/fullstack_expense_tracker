const SequelizePackage = require('sequelize')
require('dotenv').config()

const sequelize = new SequelizePackage(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, { dialect: 'mysql', host: process.env.DATABASE_HOST });


module.exports = sequelize;